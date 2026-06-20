"use server";

import { getServerApi } from "@/lib/server-api";
import { revalidatePath } from "next/cache";

export async function upsertLocationAction(prevState: any, formData: FormData) {
    const api = await getServerApi();
    const id = formData.get("id");

    const data = {
        name: formData.get("name"),
        building: formData.get("building") || null,
        floor: formData.get("floor") || null,
        room: formData.get("room") || null,
    };

    try {
        if (id) {
            await api.put(`/api/locations/${id}`, data);
        } else {
            await api.post("/api/locations", data);
        }
        revalidatePath("/infra/locations");
        return { error: "", fieldErrors: {} };
    } catch (error: any) {
        return {
            error: error.response?.data?.error || "Erro ao salvar local",
            fieldErrors: {},
        };
    }
}

export async function deleteLocationAction(id: string) {
    const api = await getServerApi();
    try {
        const response = await api.delete(`/api/locations/${id}`, {
            headers: { "Content-Type": undefined },
        });

        if (response.status === 204 || !response.data?.error) {
            revalidatePath("/infra/locations");
            return { error: "" };
        }
        return { error: response.data.error };
    } catch (error: any) {
        if (error.response?.status === 204) {
            revalidatePath("/infra/locations");
            return { error: "" };
        }
        return {
            error: error.response?.data?.error || "Erro ao deletar local",
        };
    }
}
