"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { acceptInvitationAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/users/field-error";
import { acceptInvitationSchema } from "@/schemas/user";

type FormInput = z.input<typeof acceptInvitationSchema>;
type FormOutput = z.output<typeof acceptInvitationSchema>;

type Props = {
    token: string;
    email: string;
    roleLabel: string;
};

const passwordFields = [
    { name: "password", label: "Senha" },
    { name: "confirmPassword", label: "Confirmar senha" },
] as const;

export function AcceptInviteForm({ token, email, roleLabel }: Props) {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [completed, setCompleted] = useState(false);

    const form = useForm<FormInput, unknown, FormOutput>({
        resolver: zodResolver(acceptInvitationSchema),
        defaultValues: { name: "", password: "", confirmPassword: "" },
    });

    const onSubmit = (values: FormOutput) => {
        setServerError(null);
        startTransition(async () => {
            const result = await acceptInvitationAction(token, values);

            if (result.success) {
                setCompleted(true);
                toast.success(result.message);
                const params = new URLSearchParams({
                    convite: "aceito",
                    email,
                });
                router.push(`/login?${params.toString()}`);
                return;
            }

            for (const [field, messages] of Object.entries(
                result.fieldErrors ?? {},
            )) {
                if (field === "name" || field === "password") {
                    form.setError(field, { message: messages[0] });
                }
            }
            setServerError(result.error);
        });
    };

    const busy = isPending || completed;
    const nameError = form.formState.errors.name?.message;

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
        >
            <div className="grid grid-cols-1 gap-4 rounded-lg border bg-muted/40 p-3 text-sm">
                <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">E-mail</span>
                    <span className="font-medium truncate">{email}</span>
                </div>
                <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Função</span>
                    <span className="font-medium">{roleLabel}</span>
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="invite-name">
                    Nome completo <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="invite-name"
                    autoComplete="name"
                    autoFocus
                    disabled={busy}
                    aria-invalid={!!nameError}
                    className={
                        nameError
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                    }
                    {...form.register("name")}
                />
                <FieldError errors={nameError ? [nameError] : undefined} />
            </div>

            {passwordFields.map((field) => {
                const message = form.formState.errors[field.name]?.message;
                const id = `invite-${field.name}`;
                return (
                    <div key={field.name} className="space-y-1.5">
                        <Label htmlFor={id}>
                            {field.label}{" "}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id={id}
                            type="password"
                            autoComplete="new-password"
                            disabled={busy}
                            aria-invalid={!!message}
                            className={
                                message
                                    ? "border-destructive focus-visible:ring-destructive"
                                    : ""
                            }
                            {...form.register(field.name)}
                        />
                        <FieldError errors={message ? [message] : undefined} />
                    </div>
                );
            })}
            <p className="text-xs text-muted-foreground -mt-2">
                Use pelo menos 8 caracteres.
            </p>

            {serverError && (
                <div
                    role="alert"
                    className="flex items-start gap-3 text-destructive text-sm p-3 bg-destructive/10 rounded-lg border border-destructive/20"
                >
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{serverError}</span>
                </div>
            )}

            <Button type="submit" className="w-full gap-2" disabled={busy}>
                {busy ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {completed ? "Redirecionando..." : "Criando conta..."}
                    </>
                ) : (
                    "Criar minha conta"
                )}
            </Button>
        </form>
    );
}
