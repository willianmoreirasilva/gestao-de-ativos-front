//Ações genéricas compartilhadas entre todos os tipos de ativos
//(Conectividade, Alocação e Verificação de IP).

"use server";

import { getServerApi } from "@/lib/server-api";
import { sanitizePayloadForBackend } from "@/lib/utils";

import { ActionResponse, handleError, revalidateAssetPaths } from "./helpers";

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
 * 🔍 VALIDAÇÃO DE IP POR ESCOPO
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

        const response = await api.get("/api/ip-addresses/verify", {
            params: {
                address: cleanAddress,
                expectedType: expectedVlanType,
            },
        });

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
