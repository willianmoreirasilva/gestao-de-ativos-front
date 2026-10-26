"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Mail } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { inviteUserAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FieldError } from "@/components/users/field-error";
import { ROLE_LABELS } from "@/lib/user-roles";
import { inviteUserSchema, USER_ROLES } from "@/schemas/user";

type FormInput = z.input<typeof inviteUserSchema>;
type FormOutput = z.output<typeof inviteUserSchema>;

const defaultValues: FormInput = { email: "", role: "USER" };

export function InviteUserDialog() {
    const [open, setOpen] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const form = useForm<FormInput, unknown, FormOutput>({
        resolver: zodResolver(inviteUserSchema),
        defaultValues,
    });

    const handleOpenChange = (next: boolean) => {
        if (isPending) return;
        setOpen(next);
        if (!next) {
            form.reset(defaultValues);
            setServerError(null);
        }
    };

    const onSubmit = (values: FormOutput) => {
        setServerError(null);
        startTransition(async () => {
            const result = await inviteUserAction(values);

            if (result.success) {
                toast.success(result.message);
                form.reset(defaultValues);
                setOpen(false);
                return;
            }

            for (const [field, messages] of Object.entries(
                result.fieldErrors ?? {},
            )) {
                if (field === "email" || field === "role") {
                    form.setError(field, { message: messages[0] });
                }
            }
            setServerError(result.error);
            toast.error(result.error);
        });
    };

    const emailError = form.formState.errors.email?.message;
    const roleError = form.formState.errors.role?.message;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2 shadow-sm">
                    <Mail size={16} />
                    Convidar usuário
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Convidar usuário</DialogTitle>
                    <DialogDescription>
                        Informe o e-mail e a função inicial. O acesso só é
                        criado quando o convidado aceitar o convite.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                    noValidate
                >
                    <div className="space-y-2">
                        <Label htmlFor="invite-email">
                            E-mail do convidado{" "}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="invite-email"
                            type="email"
                            autoComplete="off"
                            placeholder="nome@empresa.com"
                            disabled={isPending}
                            aria-invalid={!!emailError}
                            className={
                                emailError
                                    ? "border-destructive focus-visible:ring-destructive"
                                    : ""
                            }
                            {...form.register("email")}
                        />
                        <FieldError
                            errors={emailError ? [emailError] : undefined}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="invite-role">Função inicial</Label>
                        <Controller
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={isPending}
                                >
                                    <SelectTrigger id="invite-role">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {USER_ROLES.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {ROLE_LABELS[role]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FieldError
                            errors={roleError ? [roleError] : undefined}
                        />
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

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="gap-2"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Enviando convite...
                                </>
                            ) : (
                                "Enviar convite"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
