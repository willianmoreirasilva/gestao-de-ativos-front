//Ações isoladas específicas de Computadores.

"use server";

import { revalidatePath } from "next/cache";

import { getServerApi } from "@/lib/server-api";
import { sanitizeNullable, sanitizePayloadForBackend } from "@/lib/utils";
import { ComputerFormValues } from "@/schemas/asset-create.schema";
import { ActionResult } from "@/types/assets";

import { ActionResponse, handleError, revalidateAssetPaths } from "./helpers";
import { findIpByAddressAction } from "./shared.actions";

/**
 * 🔄 ATUALIZAR ESPECIFICAÇÕES DO COMPUTADOR (PUT)
 */
export async function updateComputerSpecsAction(
    assetId: string,
    payload: {
        username?: string | null;
        hostname?: string | null;
        anydesk?: string | null;
        mac?: string | null;
        processorId?: string | null;
        memory?: string | null;
        diskId?: string | null;
        osId?: string | null;
        notes?: string | null;
    },
): Promise<ActionResponse> {
    try {
        const api = await getServerApi();
        const sanitized = sanitizePayloadForBackend(payload);

        const response = await api.put(
            `/api/assets/${assetId}/specs/computer`,
            sanitized,
        );
        await revalidateAssetPaths(assetId, "computers");

        return { success: true, data: response.data?.data };
    } catch (error: any) {
        return handleError(
            error,
            "Erro ao atualizar as especificações do computador.",
        );
    }
}

/**
 * ➕ CADASTRAR NOVO COMPUTADOR (POST)
 */

export async function createComputerAssetAction(
    formData: ComputerFormValues,
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
            if (!Number.isNaN(num) && num > 0) {
                parsedSwitchPort = num;
            }
        }

        const payload = {
            type: "COMPUTER",
            patrimony: sanitizeNullable(formData.patrimony),
            departmentId: sanitizeNullable(formData.departmentId),
            locationId: sanitizeNullable(
                formData.unitId || formData.locationId,
            ),
            ipId: resolvedIpId,
            connectedToSwitchId: sanitizeNullable(formData.switchId),
            switchPort: parsedSwitchPort,

            computer: {
                hostname: formData.hostname.trim(),
                username: sanitizeNullable(formData.username) ?? "",
                mac: sanitizeNullable(formData.mac),
                anydesk: sanitizeNullable(formData.anydesk),
                processorId: sanitizeNullable(formData.processorId),
                diskId: sanitizeNullable(formData.diskId),
                osId: sanitizeNullable(formData.osId),
                memory: sanitizeNullable(formData.memory),
                notes: sanitizeNullable(formData.notes),
            },
        };

        const response = await api.post("/api/assets", payload);

        revalidatePath("/assets");
        revalidatePath("/assets/computers");

        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        if (error.response?.data) {
            const apiData = error.response.data;

            if (
                apiData.fieldErrors &&
                Object.keys(apiData.fieldErrors).length > 0
            ) {
                return {
                    success: false,
                    fieldErrors: apiData.fieldErrors,
                };
            }

            const errorMsg =
                apiData.message || apiData.error || "Erro ao salvar o ativo.";

            if (
                errorMsg.toLowerCase().includes("switch") ||
                errorMsg.toLowerCase().includes("porta")
            ) {
                return {
                    success: false,
                    fieldErrors: { switchPort: [errorMsg] },
                };
            }

            return {
                success: false,
                fieldErrors: { manualIpValue: [errorMsg] },
                error: errorMsg,
            };
        }

        return {
            success: false,
            error: "Falha de comunicação com o servidor.",
        };
    }
}
