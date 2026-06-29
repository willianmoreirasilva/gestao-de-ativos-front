"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { getServerApi } from "@/lib/server-api";
import { departmentSchema } from "@/schemas/department";
import { Department } from "@/types/department";

type ActionState = {
    error: string;
    fieldErrors: Record<string, string[]>;
    data?: Department; // 🌟 Adicionado para capturar o ID retornado pela Server Action
};

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

export async function upsertDepartmentAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const id = formData.get("id") as string | null;
    const name = formData.get("name") as string;

    // Validate data
    const validation = departmentSchema.safeParse({ name });
    if (!validation.success) {
        return {
            error: "Erro de validação",
            fieldErrors: formatZodErrors(validation.error),
        };
    }

    const api = await getServerApi();

    try {
        let response;
        if (id) {
            //Update
            response = await api.put(`/api/departments/${id}`, { name });
        } else {
            //Create
            response = await api.post("/api/departments", { name });
        }
        // Se o backend retornou um erro estruturado dentro do 200/201
        if (response.data.error) {
            return {
                error: response.data.error,
                fieldErrors: {},
            };
        }
       // 🌟 CAPTURA EXATA: Obtém o ID de dentro do objeto 'data' enviado pela sua API
        const createdOrUpdatedId = response.data?.data?.id || id || "";
          revalidatePath("/infra/departments");

        return {
            error: "",
            fieldErrors: {},
            data: createdOrUpdatedId // Entrega o ID limpo para o formulário
        };

    } catch (error: unknown) {
        const apiError = error as { response?: { data?: { error?: string } } };
        return {
            error:
                apiError.response?.data?.error || "Erro ao salvar departamento",
            fieldErrors: {},
        };
    }

    revalidatePath("/infra/departments");
    redirect("/infra/departments");
}

export async function deleteDepartmentAction(id: string) {
    const api = await getServerApi();
    try {
        // 🌟 O PULO DO GATO: Forçamos o Content-Type a ser 'undefined' nesta requisição específica
        const response = await api.delete(`/api/departments/${id}`, {
            headers: {
                "Content-Type": undefined,
            },
        });

        if (response.status === 204) {
            revalidatePath("/infra/departments");
            return { error: "", fieldErrors: {} };
        }

        if (response.data?.error) {
            return { error: response.data.error, fieldErrors: {} };
        }

        revalidatePath("/infra/departments");
        return { error: "", fieldErrors: {} };
    } catch (error: unknown) {
        const apiError = error as {
            response?: { status?: number; data?: { error?: string } };
        };

        if (apiError.response?.status === 204) {
            revalidatePath("/infra/departments");
            return { error: "", fieldErrors: {} };
        }

        return {
            error:
                apiError.response?.data?.error ||
                "Erro ao deletar departamento",
            fieldErrors: {},
        };
    }
}
