"use server";

import { revalidatePath } from "next/cache";

import { getServerApi } from "@/lib/server-api";
import {
    CreateAccessPointInput,
    UpdateAccessPointInput,
} from "@/types/access-points";

/**
 * Cria um novo Access Point no sistema
 */
export async function createAccessPointAction(data: CreateAccessPointInput) {
    try {
        const api = await getServerApi();
        const response = await api.post("/api/access-points", data);

        revalidatePath("/assets/access-points");
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("❌ [createAccessPointAction Error]:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                "Não foi possível cadastrar o Access Point.",
        };
    }
}

/**
 * Atualiza os dados de um Access Point existente (Hardware / Especificações Técnicas)
 */
export async function updateAccessPointAction(
    id: string,
    data: UpdateAccessPointInput,
) {
    try {
        const api = await getServerApi();
        const response = await api.patch(`/api/access-points/${id}`, data);

        revalidatePath(`/assets/access-points/${id}`);
        revalidatePath("/assets/access-points");
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("❌ [updateAccessPointAction Error]:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                "Não foi possível atualizar as informações do Access Point.",
        };
    }
}

/**
 * Exclui um Access Point
 */
export async function deleteAccessPointAction(id: string) {
    try {
        const api = await getServerApi();
        await api.delete(`/api/access-points/${id}`);

        revalidatePath("/assets/access-points");
        return { success: true };
    } catch (error: any) {
        console.error("❌ [deleteAccessPointAction Error]:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                "Não foi possível excluir o Access Point.",
        };
    }
}
