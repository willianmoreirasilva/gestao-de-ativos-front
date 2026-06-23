"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { getServerApi } from "@/lib/server-api";
import { networkSchema } from "@/schemas/network";

type ActionState = {
    error: string;
    fieldErrors: Record<string, string[]>;
};

function formatZodErrors(error: ZodError): Record<string, string[]> {
    const formatted: Record<string, string[]> = {};
    for (const issue of error.issues) {
        const path = issue.path.join(".");
        if (!formatted[path]) formatted[path] = [];
        formatted[path].push(issue.message);
    }
    return formatted;
}

export async function upsertNetworkAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const id = formData.get("id") as string | null;

    const rawData = {
        networkAddress: (formData.get("networkAddress") as string)?.trim(),
        cidr: formData.get("cidr"),
        vlanTag: formData.get("vlanTag") ? formData.get("vlanTag") : null,
        type: formData.get("type"),
    };

    // 1. Validação estrutural básica do Zod (Garante que é um IP no formato correto)
    const validation = networkSchema.safeParse(rawData);
    if (!validation.success) {
        return {
            error: "Erro de validação nos campos.",
            fieldErrors: formatZodErrors(validation.error),
        };
    }

    const api = await getServerApi();
    let isSuccess = false;

    try {
        let response;
        if (id) {
            // Edição (PUT) - Envia apenas a VLAN de acordo com a regra de negócio
            const putPayload = { vlanTag: validation.data.vlanTag };

            response = await api.patch(`/api/networks/${id}`, putPayload);
        } else {
            // Criação (POST) - Envia tudo
            response = await api.post("/api/networks", validation.data);
        }

        // 🌟 CASO A: API respondeu com Status 200/201 mas enviou um objeto contendo { error: "..." }
        if (response.data?.error) {
            return {
                error: response.data.error, // "Registro já existe" ou "O endereço IP informado não é o endereço base..."
                fieldErrors: {},
            };
        }

        isSuccess = true;
    } catch (error: unknown) {
        // 🌟 CASO B: API rejeitou a requisição e caiu no Catch (Ex: Status 400 Bad Request, 409 Conflict)
        const apiError = error as {
            response?: { status?: number; data?: { error?: string } };
        };

        return {
            error:
                apiError.response?.data?.error ||
                "Falha de comunicação com o servidor de redes.",
            fieldErrors: {},
        };
    }

    // Só realiza o redirecionamento se passou por todas as checagens acima sem nenhum erro
    if (isSuccess) {
        revalidatePath("/infra/networks");
        redirect("/infra/networks");
    }

    return {
        error: "Erro inesperado ao processar requisição.",
        fieldErrors: {},
    };
}
export async function deleteNetworkAction(id: string) {
    const api = await getServerApi();
    try {
        const response = await api.delete(`/api/networks/${id}`, {
            headers: { "Content-Type": undefined },
        });

        if (response.status === 204) {
            revalidatePath("/infra/networks");
            return { error: "", fieldErrors: {} };
        }

        if (response.data?.error) {
            return { error: response.data.error, fieldErrors: {} };
        }

        revalidatePath("/infra/networks");
        return { error: "", fieldErrors: {} };
    } catch (error: unknown) {
        const apiError = error as {
            response?: { status?: number; data?: { error?: string } };
        };
        if (apiError.response?.status === 204) {
            revalidatePath("/infra/networks");
            return { error: "", fieldErrors: {} };
        }
        return {
            error: apiError.response?.data?.error || "Erro ao deletar rede",
            fieldErrors: {},
        };
    }
}
