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
 * Transforma strings vazias em null, preserva nulls explícitos para o Prisma zerar campos,
 * e ignora undefined para evitar sobrescrever dados não enviados.
 */
function sanitizePayloadForBackend(obj: any): any {
    // 1. undefined é ignorado (não altera o banco)
    if (obj === undefined) return undefined;

    // 2. null é preservado (instrução para o Prisma zerar/desvincular o campo)
    if (obj === null) return null;

    // 3. Strings vazias viram null, strings preenchidas sofrem trim
    if (typeof obj === "string") return obj.trim() === "" ? null : obj.trim();

    // 4. Tratamento recursivo de Arrays
    if (Array.isArray(obj)) return obj.map(sanitizePayloadForBackend);

    // 5. Tratamento recursivo de Objetos
    if (typeof obj === "object") {
        const cleaned: any = {};
        for (const key of Object.keys(obj)) {
            const val = obj[key];
            if (val === undefined) continue;

            const sanitizedVal = sanitizePayloadForBackend(val);
            // Só adiciona a chave se o valor retornado não for undefined
            if (sanitizedVal !== undefined) {
                cleaned[key] = sanitizedVal;
            }
        }
        return cleaned;
    }

    return obj;
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
