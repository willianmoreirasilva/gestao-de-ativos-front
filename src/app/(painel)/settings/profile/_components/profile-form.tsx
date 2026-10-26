"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { updateMyProfileAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/users/field-error";
import { authClient } from "@/lib/auth-client";
import { updateProfileSchema } from "@/schemas/user";

type FormInput = z.input<typeof updateProfileSchema>;
type FormOutput = z.output<typeof updateProfileSchema>;

type Props = {
    name: string;
    email: string;
    roleLabel: string;
};

export function ProfileForm({ name, email, roleLabel }: Props) {
    const router = useRouter();
    const { refetch } = authClient.useSession();
    const [serverError, setServerError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const form = useForm<FormInput, unknown, FormOutput>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: { name },
    });

    const onSubmit = (values: FormOutput) => {
        setServerError(null);
        startTransition(async () => {
            const result = await updateMyProfileAction(values);

            if (result.success) {
                toast.success(result.message);
                form.reset({ name: values.name });
                // Atualiza o nome exibido no menu lateral
                await refetch();
                router.refresh();
                return;
            }

            const nameErrors = result.fieldErrors?.name;
            if (nameErrors?.length) {
                form.setError("name", { message: nameErrors[0] });
            }
            setServerError(result.error);
            toast.error(result.error);
        });
    };

    const nameError = form.formState.errors.name?.message;

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="profile-email">E-mail</Label>
                    <Input
                        id="profile-email"
                        value={email}
                        readOnly
                        disabled
                        className="bg-muted/50"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="profile-role">Função</Label>
                    <Input
                        id="profile-role"
                        value={roleLabel}
                        readOnly
                        disabled
                        className="bg-muted/50"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="profile-name">
                    Nome <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="profile-name"
                    autoComplete="name"
                    disabled={isPending}
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
                    disabled={isPending || !form.formState.isDirty}
                    className="gap-2 w-full sm:w-auto"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Salvar alterações
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
