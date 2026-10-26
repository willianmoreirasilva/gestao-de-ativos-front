"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";

import { AVATAR_MAX_BYTES, buildAvatarFormData } from "@/lib/avatar";
import { getServerApi } from "@/lib/server-api";
import {
    acceptInvitationSchema,
    avatarCropSchema,
    inviteUserSchema,
    updateProfileSchema,
    updateUserRoleSchema,
} from "@/schemas/user";
import { extractApiError } from "@/services/user";
import type { AvatarActionResult, UserActionResult } from "@/types/user";

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

// avatar: FormData opcional montado com buildAvatarFormData (cropX, cropY, cropSize e file)
export async function acceptInvitationAction(
    token: string,
    input: unknown,
    avatar?: FormData | null,
): Promise<UserActionResult> {
    if (!token) {
        return { success: false, error: "Convite inválido." };
    }

    const parsed = acceptInvitationSchema.safeParse(input);
    if (!parsed.success) return validationError(parsed.error);

    const body = new FormData();
    body.append("token", token);
    body.append("name", parsed.data.name);
    body.append("password", parsed.data.password);

    // Foto opcional: o próprio convidado escolhe ao criar a conta
    const file = avatar?.get("file");
    if (file instanceof File && file.size > 0) {
        if (file.size > AVATAR_MAX_BYTES) {
            return {
                success: false,
                error: "A imagem deve ter no máximo 5 MB.",
            };
        }
        const crop = avatarCropSchema.safeParse({
            x: avatar?.get("cropX"),
            y: avatar?.get("cropY"),
            size: avatar?.get("cropSize"),
        });
        if (!crop.success) {
            return { success: false, error: "Área de recorte inválida." };
        }
        const avatarData = buildAvatarFormData(file, crop.data);
        for (const [key, value] of avatarData.entries()) {
            body.append(key, value);
        }
    }

    try {
        const api = await getServerApi();
        const response = await api.post("/api/users/invitations/accept", body, {
            headers: { "Content-Type": "multipart/form-data" },
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

function readAvatarResponse(data: unknown): {
    image: string | null;
    message: string | null;
} {
    if (!data || typeof data !== "object") {
        return { image: null, message: null };
    }
    const image =
        "image" in data && typeof data.image === "string" ? data.image : null;
    return { image, message: readMessage(data, "") || null };
}

export async function updateMyAvatarAction(
    formData: FormData,
): Promise<AvatarActionResult> {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
        return { success: false, error: "Selecione uma imagem." };
    }
    if (file.size > AVATAR_MAX_BYTES) {
        return { success: false, error: "A imagem deve ter no máximo 5 MB." };
    }

    const crop = avatarCropSchema.safeParse({
        x: formData.get("cropX"),
        y: formData.get("cropY"),
        size: formData.get("cropSize"),
    });
    if (!crop.success) {
        return { success: false, error: "Área de recorte inválida." };
    }

    try {
        const api = await getServerApi();
        // O usuário alterado é o da sessão; nenhum id é enviado
        const response = await api.put(
            "/api/users/me/avatar",
            buildAvatarFormData(file, crop.data),
            { headers: { "Content-Type": "multipart/form-data" } },
        );
        const { image, message } = readAvatarResponse(response.data);

        revalidatePath("/settings/profile");
        revalidatePath("/", "layout");
        return {
            success: true,
            image,
            message: message ?? "Foto de perfil atualizada.",
        };
    } catch (error) {
        return {
            success: false,
            error: extractApiError(
                error,
                "Não foi possível atualizar a foto de perfil.",
            ).message,
        };
    }
}

export async function removeMyAvatarAction(): Promise<AvatarActionResult> {
    try {
        const api = await getServerApi();
        // DELETE sem corpo: o Fastify rejeita Content-Type JSON vazio
        const response = await api.delete("/api/users/me/avatar", {
            headers: { "Content-Type": undefined },
        });
        const { message } = readAvatarResponse(response.data);

        revalidatePath("/settings/profile");
        revalidatePath("/", "layout");
        return {
            success: true,
            image: null,
            message: message ?? "Foto de perfil removida.",
        };
    } catch (error) {
        return {
            success: false,
            error: extractApiError(
                error,
                "Não foi possível remover a foto de perfil.",
            ).message,
        };
    }
}
