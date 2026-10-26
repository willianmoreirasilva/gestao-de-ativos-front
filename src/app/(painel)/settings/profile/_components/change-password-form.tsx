"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, KeyRound, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/users/field-error";
import { authClient } from "@/lib/auth-client";
import { type ChangePasswordInput, changePasswordSchema } from "@/schemas/user";

const emptyValues: ChangePasswordInput = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

// Códigos de erro do Better Auth traduzidos para o usuário
const AUTH_ERROR_MESSAGES: Record<string, string> = {
    INVALID_PASSWORD: "A senha atual está incorreta.",
    PASSWORD_TOO_SHORT: "A nova senha é muito curta.",
    PASSWORD_TOO_LONG: "A nova senha é muito longa.",
    CREDENTIAL_ACCOUNT_NOT_FOUND:
        "Sua conta não possui senha cadastrada para alteração.",
};

const fields = [
    {
        name: "currentPassword",
        label: "Senha atual",
        autoComplete: "current-password",
    },
    { name: "newPassword", label: "Nova senha", autoComplete: "new-password" },
    {
        name: "confirmPassword",
        label: "Confirmar nova senha",
        autoComplete: "new-password",
    },
] as const;

export function ChangePasswordForm() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const form = useForm<ChangePasswordInput>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: emptyValues,
    });

    const onSubmit = (values: ChangePasswordInput) => {
        setServerError(null);
        startTransition(async () => {
            const { error } = await authClient.changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
                revokeOtherSessions: true,
            });

            if (error) {
                const message =
                    (error.code && AUTH_ERROR_MESSAGES[error.code]) ||
                    "Não foi possível alterar a senha. Tente novamente.";
                setServerError(message);
                toast.error(message);
                return;
            }

            toast.success("Senha alterada com sucesso.");
            form.reset(emptyValues);
        });
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
        >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {fields.map((field) => {
                    const message = form.formState.errors[field.name]?.message;
                    const id = `password-${field.name}`;
                    return (
                        <div key={field.name} className="space-y-2">
                            <Label htmlFor={id}>{field.label}</Label>
                            <Input
                                id={id}
                                type="password"
                                autoComplete={field.autoComplete}
                                disabled={isPending}
                                aria-invalid={!!message}
                                className={
                                    message
                                        ? "border-destructive focus-visible:ring-destructive"
                                        : ""
                                }
                                {...form.register(field.name)}
                            />
                            <FieldError
                                errors={message ? [message] : undefined}
                            />
                        </div>
                    );
                })}
            </div>

            {serverError && (
                <div
                    role="alert"
                    className="flex items-start gap-3 text-destructive text-sm p-3 bg-destructive/10 rounded-lg border border-destructive/20"
                >
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{serverError}</span>
                </div>
            )}

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={isPending}
                    className="gap-2 w-full sm:w-auto"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Alterando...
                        </>
                    ) : (
                        <>
                            <KeyRound className="h-4 w-4" />
                            Alterar senha
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
