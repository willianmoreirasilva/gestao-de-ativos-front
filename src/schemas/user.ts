import { z } from "zod";

export const USER_ROLES = [
    "SUPERADM",
    "ADMIN",
    "USER",
    "CAM_OPERATOR",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const userRoleSchema = z.enum(USER_ROLES, {
    error: "Selecione uma função válida",
});

export const inviteUserSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, "E-mail é obrigatório")
        .pipe(z.email("Informe um e-mail válido")),
    role: userRoleSchema.default("USER"),
});

export const updateUserRoleSchema = z.object({
    role: userRoleSchema,
});

export const updateProfileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Nome é obrigatório")
        .min(2, "Nome deve ter pelo menos 2 caracteres")
        .max(100, "Nome deve ter no máximo 100 caracteres"),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Senha atual é obrigatória"),
        newPassword: z
            .string()
            .min(8, "Nova senha deve ter pelo menos 8 caracteres"),
        confirmPassword: z.string().min(1, "Confirme a nova senha"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    });

export const acceptInvitationSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, "Nome é obrigatório")
            .min(2, "Nome deve ter pelo menos 2 caracteres")
            .max(100, "Nome deve ter no máximo 100 caracteres"),
        password: z
            .string()
            .min(8, "A senha deve ter pelo menos 8 caracteres")
            .max(128, "A senha deve ter no máximo 128 caracteres"),
        confirmPassword: z.string().min(1, "Confirme a senha"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    });

export type InviteUserInput = z.input<typeof inviteUserSchema>;
export type UpdateProfileInput = z.input<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type AcceptInvitationInput = z.input<typeof acceptInvitationSchema>;

// Recorte do avatar recebido pelo Server Action (campos de FormData)
export const avatarCropSchema = z.object({
    x: z.coerce.number().int().min(0),
    y: z.coerce.number().int().min(0),
    size: z.coerce.number().int().min(1),
});
