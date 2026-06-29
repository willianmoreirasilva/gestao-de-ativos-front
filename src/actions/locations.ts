"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { getServerApi } from "@/lib/server-api";
import { locationSchema } from "@/schemas/location";
import { Location } from "@/types/location";

type ActionState = {
    error: string;
    fieldErrors: Record<string, string[]>;
    data?: Location;
};

// Helper idêntico ao de departamentos para formatar erros do Zod
function formatZodErrors(error: ZodError): Record<string, string[]> {
    const formatted: Record<string, string[]> = {};
    for (const issue of error.issues) {
        const path = issue.path.join(".");
        if (!formatted[path]) {
            formatted[path] = [];
        }
        formatted[path].push(issue.message);
    }
    return formatted;
}

export async function upsertLocationAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const id = formData.get("id") as string | null;
    const rawData = {
        name: (formData.get("name") as string)?.trim(),
        building: (formData.get("building") as string)?.trim() || null,
        floor: (formData.get("floor") as string)?.trim() || null,
        room: (formData.get("room") as string)?.trim() || null,
        notes: (formData.get("notes") as string)?.trim() || null,
    };

    const validation = locationSchema.safeParse(rawData);
    if (!validation.success) {
        return {
            error: "Erro de validação",
            fieldErrors: formatZodErrors(validation.error),
        };
    }

    const data = validation.data;
    const api = await getServerApi();
    

    try {
        let response;
        if (id) {
            response = await api.put(`/api/locations/${id}`, data);
        } else {
            response = await api.post("/api/locations", data);
        }

        if (response.data?.error) {
            return {
                error: response.data.error,
                fieldErrors: {},
            };
        }

        
        const createdLocation: Location = response.data?.data?.id  || { id: id || "" };
        
        revalidatePath("/infra/locations");
        
        return {
            error: "",
            fieldErrors: {},
            data: createdLocation,
        };
    } catch (error: unknown) {
        const apiError = error as {
            response?: { status?: number; data?: { error?: string } };
        };
        return {
            error: apiError.response?.data?.error || "Erro ao salvar local",
            fieldErrors: {},
        };
    }
}
export async function deleteLocationAction(id: string) {
    const api = await getServerApi();
    try {
        // Mantém a trava de Content-Type undefined contra falhas de requisição vazia do Axios
        const response = await api.delete(`/api/locations/${id}`, {
            headers: {
                "Content-Type": undefined,
            },
        });

        if (response.status === 204) {
            revalidatePath("/infra/locations");
            return { error: "", fieldErrors: {} };
        }

        if (response.data?.error) {
            return { error: response.data.error, fieldErrors: {} };
        }

        revalidatePath("/infra/locations");
        return { error: "", fieldErrors: {} };
    } catch (error: unknown) {
        const apiError = error as {
            response?: { status?: number; data?: { error?: string } };
        };

        // Tratamento idêntico ao de departamentos para o status 204 capturado pelo bloco catch
        if (apiError.response?.status === 204) {
            revalidatePath("/infra/locations");
            return { error: "", fieldErrors: {} };
        }

        return {
            error: apiError.response?.data?.error || "Erro ao deletar local",
            fieldErrors: {},
        };
    }
}
