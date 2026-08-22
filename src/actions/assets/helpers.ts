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
 * Auxiliar para revalidar caminhos de ativos de forma genérica
 */
export async function revalidateAssetPaths(assetId?: string): Promise<void> {
    revalidatePath("/assets");
    if (assetId) {
        revalidatePath(`/assets/${assetId}`);
    }
}
