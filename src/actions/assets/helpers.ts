//(Utilitários reutilizáveis de sanitização e tratamento de erro)

"use server";

import { revalidatePath } from "next/cache";

export interface ActionResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    fieldErrors?: { [key: string]: string[] } | null;
}

/**
 * Auxiliar para tratamento padronizado de erros
 */
export async function handleError(
    error: any,
    defaultMessage: string,
): Promise<ActionResponse> {
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
 * Auxiliar para revalidar caminhos de ativos de forma flexível
 * @param assetId - ID do ativo (opcional)
 * @param typePath - Sub-rota do tipo de ativo ex: "computers", "cameras", "phones" (opcional)
 */
export async function revalidateAssetPaths(
    assetId?: string,
    typePath?: string,
): Promise<void> {
    // 1. Revalida a listagem geral
    revalidatePath("/assets");

    // 2. Se informou o tipo de ativo (ex: /assets/computers)
    if (typePath) {
        revalidatePath(`/assets/${typePath}`);
    }

    // 3. Se informou o ID do ativo
    if (assetId) {
        revalidatePath(`/assets/${assetId}`);
        // Se também tiver o tipo, revalida a página detalhada da categoria
        if (typePath) {
            revalidatePath(`/assets/${typePath}/${assetId}`);
        }
    }
}
