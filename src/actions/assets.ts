"use server";

import { revalidatePath } from "next/cache";

import { getServerApi } from "@/lib/server-api";
import { sanitizePayloadForBackend } from "@/lib/utils";
import { ComputerFormValues } from "@/schemas/asset-create.schema";
import { ActionResult, CreateComputerPayload } from "@/types/assets";

interface ActionResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    fieldErrors?: { [key: string]: string[] } | null;
}

/**
 * Auxiliar para tratamento padronizado de erros
 */
function handleError(error: any, defaultMessage: string): ActionResponse {
    console.error(`[ASSET_ACTION_ERROR]:`, error?.response?.data || error);
    return {
        success: false,
        error:
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            defaultMessage,
        fieldErrors: error?.response?.data?.fieldErrors || null,
    };
}

/**
 * Auxiliar para revalidar caminhos do ativo de forma genérica
 */
function revalidateAssetPaths(assetId: string) {
    revalidatePath("/assets");
    revalidatePath(`/assets/${assetId}`);
    revalidatePath("/assets/computers");
    revalidatePath(`/assets/computers/${assetId}`);
}

/**
 * 🔄 CARD 1: CONECTIVIDADE IP & REDE (PATCH)
 */
export async function updateAssetConnectivityAction(
    assetId: string,
    payload: {
        newIpId?: string | null;
        connectedToSwitchId?: string | null;
        switchPort?: number | null;
    },
): Promise<ActionResponse> {
    try {
        const api = await getServerApi();
        const sanitized = sanitizePayloadForBackend(payload);

        const response = await api.patch(
            `/api/assets/${assetId}/connectivity`,
            sanitized,
        );
        revalidateAssetPaths(assetId);

        return { success: true, data: response.data?.data };
    } catch (error: any) {
        return handleError(
            error,
            "Erro ao atualizar os dados de conectividade de rede.",
        );
    }
}

/**
 * 🔄 CARD 2: ALOCAÇÃO E RESPONSABILIDADE PATRIMONIAL (PATCH)
 */
export async function updateAssetAllocationAction(
    assetId: string,
    payload: {
        patrimony?: string | null;
        departmentId?: string | null;
        locationId?: string | null;
    },
): Promise<ActionResponse> {
    try {
        const api = await getServerApi();
        const sanitized = sanitizePayloadForBackend(payload);

        const response = await api.patch(
            `/api/assets/${assetId}/allocation`,
            sanitized,
        );
        revalidateAssetPaths(assetId);

        return { success: true, data: response.data?.data };
    } catch (error: any) {
        return handleError(
            error,
            "Erro ao atualizar os dados de alocação física.",
        );
    }
}

/**
 * 🔍 VALIDAÇÃO DE IP POR ESCOPO (Chama a nova rota dedicada)
 */
export async function findIpByAddressAction(
    address: string,
    expectedVlanType:
        | "GENERAL_DATA"
        | "CAMERA_VLAN"
        | "SWITCH_MGMT"
        | "WIFI_MGMT",
) {
    try {
        const api = await getServerApi();
        const cleanAddress = address.trim();

        // Rota dedicada e otimizada do backend
        const response = await api.get("/api/ip-addresses/verify", {
            params: {
                address: cleanAddress,
                expectedType: expectedVlanType,
            },
        });

        // O backend responde com { success: true, data: { id, address, status, network } }
        return {
            success: true,
            data: response.data.data,
        };
    } catch (error: any) {
        console.error(
            "❌ [findIpByAddressAction Error]:",
            error?.response?.data || error.message,
        );

        return {
            success: false,
            error:
                error.response?.data?.error ||
                "O endereço IP informado não é válido para este ativo.",
        };
    }
}

// Helper para converter strings vazias ou com apenas espaços em NULL
const sanitizeNullable = (value?: string | null): string | null => {
    if (!value || typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
};

export async function createComputerAssetAction(
    formData: ComputerFormValues,
): Promise<ActionResult> {
    try {
        const api = await getServerApi();

        let resolvedIpId: string | null = null;

        // 🟢 1. RESOLVER IP MANUAL PARA UUID
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

        // 🟢 2. TRATAMENTO SEGURO DA PORTA DO SWITCH
        let parsedSwitchPort: number | null = null;
        if (formData.switchPort && `${formData.switchPort}`.trim() !== "") {
            const num = Number(formData.switchPort);
            if (!Number.isNaN(num) && num > 0) {
                parsedSwitchPort = num;
            }
        }

        // 🟢 3. PAYLOAD MONTAGEM
        const payload = {
            type: "COMPUTER",
            patrimony: sanitizeNullable(formData.patrimony),
            departmentId: sanitizeNullable(formData.departmentId),
            locationId: sanitizeNullable(
                formData.unitId || formData.locationId,
            ),

            // Conectividade
            ipId: resolvedIpId,
            connectedToSwitchId: sanitizeNullable(formData.switchId),
            switchPort: parsedSwitchPort, // Envia number ou null limpo

            computer: {
                hostname: formData.hostname.trim(),
                username: sanitizeNullable(formData.username) ?? "",
                mac: sanitizeNullable(formData.mac),
                processorId: sanitizeNullable(formData.processorId),
                diskId: sanitizeNullable(formData.diskId),
                osId: sanitizeNullable(formData.osId),
                memory: sanitizeNullable(formData.memory),
                notes: sanitizeNullable(formData.notes),
            },
        };

        const response = await api.post("/api/assets", payload);

        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        if (error.response?.data) {
            const apiData = error.response.data;

            // 🟢 Se o backend enviou mapa de erros por campo, repassa direto
            if (
                apiData.fieldErrors &&
                Object.keys(apiData.fieldErrors).length > 0
            ) {
                return {
                    success: false,
                    fieldErrors: apiData.fieldErrors,
                };
            }

            // 🟢 Se o backend enviou mensagem genérica, identifica o tipo de erro
            const errorMsg =
                apiData.message || apiData.error || "Erro ao salvar o ativo.";

            // Se a mensagem mencionar Switch ou Porta, atrela ao campo do Switch
            if (
                errorMsg.toLowerCase().includes("switch") ||
                errorMsg.toLowerCase().includes("porta")
            ) {
                return {
                    success: false,
                    fieldErrors: {
                        switchPort: [errorMsg],
                    },
                };
            }

            // Se for erro de IP
            return {
                success: false,
                fieldErrors: {
                    manualIpValue: [errorMsg],
                },
                error: errorMsg,
            };
        }

        return {
            success: false,
            error: "Falha de comunicação com o servidor.",
        };
    }
}
