//(Ações de Telefones/Ramais)

"use server";

import { revalidatePath } from "next/cache";

import { getServerApi } from "@/lib/server-api";
import { sanitizePayloadForBackend } from "@/lib/utils";
import { PhoneFormValues } from "@/schemas/asset-create.schema";
import { ActionResult } from "@/types/assets";

import {
    ActionResponse,
    handleError,
    revalidateAssetPaths,
    sanitizeNullable,
} from "./helpers";
import { findIpByAddressAction } from "./shared.actions";

/**
 * 🔄 ATUALIZAR ESPECIFICAÇÕES DO TELEFONE/RAMAL (PATCH)
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

        const response = await api.patch(
            `/api/assets/${assetId}/phone`,
            sanitized,
        );
        revalidateAssetPaths(assetId);

        return { success: true, data: response.data?.data };
    } catch (error: any) {
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

        // 1. RESOLVER IP MANUAL PARA UUID
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

        // 2. TRATAMENTO DA PORTA DO SWITCH
        let parsedSwitchPort: number | null = null;
        if (formData.switchPort && `${formData.switchPort}`.trim() !== "") {
            const num = Number(formData.switchPort);
            if (!Number.isNaN(num) && num > 0) {
                parsedSwitchPort = num;
            }
        }

        // 3. MONTAGEM DO PAYLOAD
        const payload = {
            type: "PHONE",
            patrimony: sanitizeNullable(formData.patrimony),
            departmentId: sanitizeNullable(formData.departmentId),
            locationId: sanitizeNullable(
                formData.unitId || formData.locationId,
            ),

            // Conectividade
            ipId: resolvedIpId,
            connectedToSwitchId: sanitizeNullable(formData.switchId),
            switchPort: parsedSwitchPort,

            // Especificidades do Telefone
            phone: {
                hostname: sanitizeNullable(formData.hostname),
                phoneNumber: formData.phoneNumber.trim(),
                model: sanitizeNullable(formData.model),
                notes: sanitizeNullable(formData.notes),
            },
        };

        const response = await api.post("/api/assets", payload);

        revalidatePath("/assets");
        revalidatePath("/assets/phones");

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
                apiData.message ||
                apiData.error ||
                "Erro ao cadastrar o telefone.";

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
