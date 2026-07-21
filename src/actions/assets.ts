"use server";

import { revalidatePath } from "next/cache";

import { getServerApi } from "@/lib/server-api";

interface ActionResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    fieldErrors?: { [key: string]: string[] } | null;
}

/**
 * 🧼 Higienizador inteligente de Payload
 */
function sanitizePayloadForBackend(obj: any): any {
    if (obj === null || obj === undefined) return undefined;
    if (typeof obj === "string") return obj.trim() === "" ? null : obj;
    if (Array.isArray(obj)) return obj.map(sanitizePayloadForBackend);

    if (typeof obj === "object") {
        const cleaned: any = {};
        for (const key of Object.keys(obj)) {
            const val = obj[key];
            if (val === undefined) continue;
            const sanitizedVal = sanitizePayloadForBackend(val);
            if (sanitizedVal !== undefined) cleaned[key] = sanitizedVal;
        }
        return cleaned;
    }
    return obj;
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
