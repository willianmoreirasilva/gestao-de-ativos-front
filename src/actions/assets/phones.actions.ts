"use server";

import { getServerApi } from "@/lib/server-api";
import { sanitizeNullable, sanitizePayloadForBackend } from "@/lib/utils";
import { PhoneFormValues } from "@/schemas/asset-create.schema";
import { ActionResult } from "@/types/assets";

import { ActionResponse, handleError, revalidateAssetPaths } from "./helpers";
import { findIpByAddressAction } from "./shared.actions";

/**
 * 🔄 ATUALIZAR ESPECIFICAÇÕES DO TELEFONE / RAMAL (PUT)
 */
export async function updatePhoneSpecsAction(
    assetId: string,
    payload: {
        hostname?: string | null;
        phoneNumber: string;
        model?: string | null;
        notes?: string | null;
    },
): Promise<ActionResponse> {
    try {
        const api = await getServerApi();
        const sanitized = sanitizePayloadForBackend(payload);

        const response = await api.put(
            `/api/assets/${assetId}/specs/phone`,
            sanitized,
        );
        await revalidateAssetPaths(assetId, "phones");

        return { success: true, data: response.data?.data };
    } catch (error) {
        return handleError(
            error,
            "Erro ao atualizar as especificações do telefone.",
        );
    }
}

/**
 * ➕ CADASTRAR NOVO TELEFONE / RAMAL (POST)
 */
export async function createPhoneAssetAction(
    formData: PhoneFormValues,
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
            type: "PHONE",
            patrimony: sanitizeNullable(formData.patrimony),
            departmentId: sanitizeNullable(formData.departmentId),
            locationId: sanitizeNullable(
                formData.unitId || formData.locationId,
            ),
            ipId: resolvedIpId,
            connectedToSwitchId: sanitizeNullable(formData.switchId),
            switchPort: parsedSwitchPort,
            phone: {
                hostname: sanitizeNullable(formData.hostname),
                phoneNumber: formData.phoneNumber.trim(),
                model: sanitizeNullable(formData.model),
                notes: sanitizeNullable(formData.notes),
            },
        };

        const response = await api.post("/api/assets", payload);
        await revalidateAssetPaths(undefined, "phones");

        return { success: true, data: response.data };
    } catch (error) {
        return handleError(error, "Erro ao cadastrar o telefone.") as any;
    }
}
