"use server";

import { revalidatePath } from "next/cache";

import { getServerApi } from "@/lib/server-api";
import { sanitizePayloadForBackend } from "@/lib/utils";
import { CreateAssetInput } from "@/schemas/assets";

interface ActionResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    fieldErrors?: { [key: string]: string[] } | null;
}

/**
 * Auxiliar para tratamento padronizado de erros do Axios/API nas Server Actions
 */
function handleError(error: any, defaultMessage: string): ActionResponse {
    console.error(
        `[ASSET_SHARED_ACTION_ERROR]:`,
        error?.response?.data || error,
    );
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
 * ➕ SALVAR ATIVO (CONCEITO UPSERT PARA CRIAÇÃO GERAL)
 * Usado na tela global para disparar o POST inicial de criação
 */
export async function saveAssetAction(
    formData: any,
    id?: string,
): Promise<ActionResponse> {
    try {
        const api = await getServerApi();
        const sanitized = sanitizePayloadForBackend(formData);

        let response;
        if (id) {
            // Caso sua arquitetura use PUT global em algum momento, mantido o suporte
            response = await api.put(`/api/assets/${id}`, sanitized);
        } else {
            // Criação base de um novo ativo (POST)
            response = await api.post("/api/assets", sanitized);
        }

        revalidatePath("/assets");
        if (id) revalidatePath(`/assets/${id}`);

        return { success: true, data: response.data?.data };
    } catch (error: any) {
        return handleError(error, "Erro ao processar os dados do ativo.");
    }
}

/**
 * 🔄 ATUALIZAR CARD DE CONECTIVIDADE (PATCH)
 * Focado na edição atômica de rede
 */
export async function updateAssetConnectivityAction(
    id: string,
    data: {
        newIpId?: string | null;
        connectedToSwitchId?: string | null;
        switchPort?: number | null;
    },
): Promise<ActionResponse> {
    try {
        const api = await getServerApi();

        const response = await api.patch(
            `/api/assets/${id}/connectivity`,
            data,
        );

        revalidatePath("/assets");
        revalidatePath(`/assets/${id}`);

        return { success: true, data: response.data?.data };
    } catch (error: any) {
        return handleError(
            error,
            "Erro ao atualizar os dados de conectividade de rede.",
        );
    }
}
/**
 * 🔄 ATUALIZAR CARD DE ALOCAÇÃO (PATCH)
 * Focado na edição atômica de localidade/setor
 */
export async function updateAssetAllocationAction(
    id: string,
    data: {
        patrimony?: string | null;
        departmentId?: string | null;
        locationId?: string | null;
    },
): Promise<ActionResponse> {
    try {
        const api = await getServerApi();
        const sanitized = sanitizePayloadForBackend(data);

        const response = await api.patch(
            `/api/assets/${id}/allocation`,
            sanitized,
        );

        revalidatePath("/assets");
        revalidatePath(`/assets/${id}`);

        return { success: true, data: response.data?.data };
    } catch (error: any) {
        return handleError(
            error,
            "Erro ao atualizar os dados de alocação e patrimônio.",
        );
    }
}

/**
 * ➕ CRIAR NOVO ATIVO (POST)
 * Cria o ativo base junto com suas especificações, conectividade e alocação.
 */
export async function createAssetAction(
    data: CreateAssetInput,
): Promise<ActionResponse<{ id: string }>> {
    try {
        const api = await getServerApi();

        // Sanitiza o payload (converte "" em null e limpa espaços)
        const sanitized = sanitizePayloadForBackend(data);

        // Dispara o POST para o backend
        const response = await api.post("/api/assets", sanitized);

        const newAssetId = response.data?.data?.id || response.data?.id;

        // Revalida a listagem do dashboard
        revalidatePath("/assets");
        revalidatePath("/assets/computers");
        revalidatePath("/assets/cameras");
        revalidatePath("/assets/printers");

        return {
            success: true,
            data: { id: newAssetId },
        };
    } catch (error: any) {
        return handleError(
            error,
            "Erro ao cadastrar o novo ativo na infraestrutura.",
        );
    }
}
