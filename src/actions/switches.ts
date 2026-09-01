"use server";

import { revalidatePath } from "next/cache";

import { getServerApi } from "@/lib/server-api";
import type {
    CreateSwitchPayload,
    UpdateSwitchPayload,
} from "@/types/switches";

/**
 * Cria um novo switch físico de rede no inventário
 */
export async function createSwitchAction(payload: CreateSwitchPayload) {
    try {
        const api = await getServerApi();
        const response = await api.post("/api/switches", payload);

        revalidatePath("/assets/switches");
        revalidatePath("/assets/computers"); // Caso algum computador precise listar esse switch

        return { success: true, data: response.data?.data, error: null };
    } catch (err: any) {
        console.error("Erro ao criar switch via action:", err);
        return {
            success: false,
            data: null,
            error:
                err.response?.data?.message ||
                "Erro interno ao cadastrar o switch.",
        };
    }
}

/**
 * Atualiza propriedades e conexões de um switch existente
 */
export async function updateSwitchAction(
    id: string,
    payload: UpdateSwitchPayload,
) {
    try {
        const api = await getServerApi();
        const response = await api.patch(`/api/switches/${id}`, payload);

        revalidatePath("/assets/switches");
        revalidatePath(`/assets/switches/${id}`);

        return { success: true, data: response.data?.data, error: null };
    } catch (err: any) {
        console.error(`Erro ao atualizar o switch ${id}:`, err);
        return {
            success: false,
            data: null,
            error:
                err.response?.data?.message ||
                "Falha ao salvar as modificações do switch.",
        };
    }
}

/**
 * Deleta um switch físico de rede do sistema
 */
// No seu deleteSwitchAction (Next.js)

export async function deleteSwitchAction(id: string) {
    try {
        const api = await getServerApi();

        // Passar data: {} impede o Axios/Fastify de chiar sobre payload ausente
        await api.delete(`/api/switches/${id}`, {
            data: {},
        });

        revalidatePath("/assets/switches");
        revalidatePath("/assets/computers");

        return { success: true, error: null };
    } catch (err: any) {
        console.error(`Erro ao deletar switch ${id}:`, err);
        return {
            success: false,
            // 💡 Busca a propriedade "error" do formato do seu errorHandler
            error:
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Não foi possível remover o switch. Tente novamente.",
        };
    }
}
