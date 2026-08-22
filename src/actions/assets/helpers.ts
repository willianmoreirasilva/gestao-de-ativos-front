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
export function handleError(
    error: any,
    defaultMessage: string,
): ActionResponse {
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
export function revalidateAssetPaths(assetId?: string) {
    revalidatePath("/assets");
    if (assetId) {
        revalidatePath(`/assets/${assetId}`);
    }
}

/**
 * Helper para converter strings vazias ou com apenas espaços em NULL
 */
export const sanitizeNullable = (value?: string | null): string | null => {
    if (!value || typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
};
