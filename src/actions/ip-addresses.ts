"use server";

import { revalidatePath } from "next/cache";
import { getServerApi } from "@/lib/server-api";

export async function updateIpStatusAction(id: string, status: "AVAILABLE" | "RESERVED", networkId: string) {
    const api = await getServerApi();
    try {
        const response = await api.patch(`/api/ip-addresses/${id}`, { status });
        
        if (response.data?.error) {
            return { error: response.data.error };
        }

        revalidatePath("/infra/networks");
        revalidatePath(`/infra/networks/${networkId}`);
        return { error: null };
    } catch (error: any) {
        return { error: error.response?.data?.error || "Falha ao atualizar status do IP" };
    }
}