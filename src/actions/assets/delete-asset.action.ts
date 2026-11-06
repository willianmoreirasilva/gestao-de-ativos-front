"use server";

import { revalidatePath } from "next/cache";

import { apiErrorMessage, getApiErrorStatus } from "@/lib/api-error";
import { getServerApi } from "@/lib/server-api";

// Revalida todas as listagens afetadas por uma exclusão
function revalidateAllAssetPaths() {
    revalidatePath("/assets");
    revalidatePath("/assets/computers");
    revalidatePath("/assets/printers");
    revalidatePath("/assets/cameras");
}

/**
 * Remove um ativo pelo ID (suporta Fastify 200/204)
 */
export async function deleteAssetAction(id: string) {
    try {
        const api = await getServerApi();

        // 🌟 Payload vazio para contornar limitações de parser em endpoints DELETE
        const response = await api.delete(`/api/assets/${id}`, {
            headers: {
                "Content-Type": "application/json",
            },
            data: {},
        });

        if (response.status === 204 || response.status === 200) {
            revalidateAllAssetPaths();
            return { error: "", fieldErrors: {} };
        }

        return { error: "", fieldErrors: {} };
    } catch (error) {
        console.error("❌ [DELETE_ASSET_ACTION_ERROR]:", error);

        const status = getApiErrorStatus(error);
        if (status === 204 || status === 200) {
            revalidateAllAssetPaths();
            return { error: "", fieldErrors: {} };
        }

        return {
            error: apiErrorMessage(
                error,
                "Erro interno do servidor ao tentar remover o ativo.",
                "error",
                "message",
            ),
            fieldErrors: {},
        };
    }
}
