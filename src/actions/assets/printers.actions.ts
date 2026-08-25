"use server";

import { getServerApi } from "@/lib/server-api";
import { sanitizeNullable, sanitizePayloadForBackend } from "@/lib/utils";
import { PrinterFormValues } from "@/schemas/asset-create.schema";
import { ActionResult } from "@/types/assets";

import { ActionResponse, handleError, revalidateAssetPaths } from "./helpers";
import { findIpByAddressAction } from "./shared.actions";

/**
 * 🔄 ATUALIZAR ESPECIFICAÇÕES DA IMPRESSORA (PUT)
 */
export async function updatePrinterSpecsAction(
    assetId: string,
    payload: {
        model: string;
        serial?: string | null;
        code?: string | null;
        notes?: string | null;
    },
): Promise<ActionResponse> {
    try {
        const api = await getServerApi();
        const sanitized = sanitizePayloadForBackend(payload);

        const response = await api.put(
            `/api/assets/${assetId}/specs/printer`,
            sanitized,
        );
        await revalidateAssetPaths(assetId, "printers");

        return { success: true, data: response.data?.data };
    } catch (error: any) {
        return handleError(
            error,
            "Erro ao atualizar as especificações da impressora.",
        );
    }
}

/**
 * ➕ CADASTRAR NOVA IMPRESSORA (POST)
 */
export async function createPrinterAssetAction(
    formData: PrinterFormValues,
): Promise<ActionResult> {
    try {
        const api = await getServerApi();
        let resolvedIpId: string | null = null;

        if (formData.isManualMode && formData.manualIpValue) {
            const cleanIp = formData.manualIpValue.trim();
            const ipLookup = await findIpByAddressAction(
                cleanIp,
                "GENERAL_DATA",
            );

            if (!ipLookup.success || !ipLookup.data?.id) {
                return {
                    success: false,
                    fieldErrors: {
                        manualIpValue: [
                            ipLookup.error ||
                                "Endereço IP indisponível ou incompatível.",
                        ],
                    },
                };
            }
            resolvedIpId = ipLookup.data.id;
        } else if (!formData.isManualMode && formData.selectedIpId) {
            resolvedIpId = sanitizeNullable(formData.selectedIpId);
        }

        let parsedSwitchPort: number | null = null;
        if (formData.switchPort && `${formData.switchPort}`.trim() !== "") {
            const num = Number(formData.switchPort);
            if (!Number.isNaN(num) && num > 0) parsedSwitchPort = num;
        }

        const payload = {
            type: "PRINTER",
            patrimony: sanitizeNullable(formData.patrimony),
            departmentId: sanitizeNullable(formData.departmentId),
            locationId: sanitizeNullable(
                formData.unitId || formData.locationId,
            ),
            ipId: resolvedIpId,
            connectedToSwitchId: sanitizeNullable(formData.switchId),
            switchPort: parsedSwitchPort,
            printer: {
                model: formData.model.trim(),
                serial: sanitizeNullable(formData.serial),
                code: sanitizeNullable(formData.code),
                notes: sanitizeNullable(formData.notes),
            },
        };

        const response = await api.post("/api/assets", payload);
        await revalidateAssetPaths(undefined, "printers");

        return { success: true, data: response.data };
    } catch (error: any) {
        return handleError(error, "Erro ao salvar a impressora.") as any;
    }
}
