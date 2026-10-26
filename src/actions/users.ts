"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";

import { getServerApi } from "@/lib/server-api";
import {
    acceptInvitationSchema,
    inviteUserSchema,
    updateProfileSchema,
    updateUserRoleSchema,
} from "@/schemas/user";
import { extractApiError } from "@/services/user";
import type { UserActionResult } from "@/types/user";

function validationError(error: ZodError): UserActionResult {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of error.issues) {
        const path = issue.path.join(".");
        (fieldErrors[path] ??= []).push(issue.message);
    }
    return {
        success: false,
        error: "Verifique os campos destacados.",
        fieldErrors,
    };
}

function readMessage(data: unknown, fallback: string): string {
    if (
        data &&
        typeof data === "object" &&
        "message" in data &&
        typeof data.message === "string"
    ) {
        return data.message;
    }
    return fallback;
}

export async function inviteUserAction(
    input: unknown,
): Promise<UserActionResult> {
    const parsed = inviteUserSchema.safeParse(input);
    if (!parsed.success) return validationError(parsed.error);

    try {
        const api = await getServerApi();
        const response = await api.post("/api/users/invitations", parsed.data);

        // A listagem não muda com o convite: não há o que revalidar
        return {
            success: true,
            message: readMessage(response.data, "Convite enviado."),
        };
    } catch (error) {
        return {
            success: false,
            error: extractApiError(error, "Não foi possível enviar o convite.")
                .message,
        };
    }
}

export async function updateUserRoleAction(
    userId: string,
    input: unknown,
): Promise<UserActionResult> {
    const parsed = updateUserRoleSchema.safeParse(input);
    if (!parsed.success) return validationError(parsed.error);

    try {
        const api = await getServerApi();
        await api.patch(
            `/api/users/${encodeURIComponent(userId)}/role`,
            parsed.data,
        );

        revalidatePath("/users");
        return { success: true, message: "Função atualizada com sucesso." };
    } catch (error) {
        return {
            success: false,
            error: extractApiError(
                error,
                "Não foi possível alterar a função do usuário.",
            ).message,
        };
    }
}

export async function deactivateUserAction(
    userId: string,
): Promise<UserActionResult> {
    try {
        const api = await getServerApi();
        // DELETE sem corpo: o Fastify rejeita Content-Type JSON vazio
        const response = await api.delete(
            `/api/users/${encodeURIComponent(userId)}`,
            { headers: { "Content-Type": undefined } },
        );

        revalidatePath("/users");
        return {
            success: true,
            message: readMessage(response.data, "Usuário desativado."),
        };
    } catch (error) {
        return {
            success: false,
            error: extractApiError(
                error,
                "Não foi possível desativar o usuário.",
            ).message,
        };
    }
}

export async function updateMyProfileAction(
    input: unknown,
): Promise<UserActionResult> {
    const parsed = updateProfileSchema.safeParse(input);
    if (!parsed.success) return validationError(parsed.error);

    try {
        const api = await getServerApi();
        await api.patch("/api/users/me", parsed.data);

        revalidatePath("/settings/profile");
        return { success: true, message: "Perfil atualizado com sucesso." };
    } catch (error) {
        return {
            success: false,
            error: extractApiError(
                error,
                "Não foi possível atualizar o perfil.",
            ).message,
        };
    }
}

export async function acceptInvitationAction(
    token: string,
    input: unknown,
): Promise<UserActionResult> {
    if (!token) {
        return { success: false, error: "Convite inválido." };
    }

    const parsed = acceptInvitationSchema.safeParse(input);
    if (!parsed.success) return validationError(parsed.error);

    try {
        const api = await getServerApi();
        const response = await api.post("/api/users/invitations/accept", {
            token,
            name: parsed.data.name,
            password: parsed.data.password,
        });

        return {
            success: true,
            message: readMessage(response.data, "Conta criada com sucesso."),
        };
    } catch (error) {
        return {
            success: false,
            error: extractApiError(
                error,
                "Não foi possível concluir o cadastro.",
            ).message,
        };
    }
}
