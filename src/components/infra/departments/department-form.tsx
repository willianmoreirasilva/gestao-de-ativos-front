"use client";

import { AlertCircle, Loader2, Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";

import { upsertDepartmentAction } from "@/actions/departments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/users/field-error";
import { Department } from "@/types/department";

type Props = {
    department?: Department;
    onSuccess?: (newId: string) => void;
    onCancel?: () => void;
};

type ActionState = {
    error: string;
    fieldErrors: Record<string, string[]>;
    data?: Department;
};

const initialState: ActionState = {
    error: "",
    fieldErrors: {},
};

export const DepartmentForm = ({ department, onSuccess, onCancel }: Props) => {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(
        upsertDepartmentAction,
        initialState,
    );

    const isEditing = !!department;

    // 🎯 Captura o sucesso da Server Action
    useEffect(() => {
        const hasId = !!state?.data?.id;
        const hasErrors =
            !!state?.error ||
            (state?.fieldErrors && Object.keys(state.fieldErrors).length > 0);

        if (hasId && !hasErrors) {
            const novoId = String(state.data!.id);

            if (onSuccess) {
                onSuccess(novoId);
            } else {
                router.push("/infra/departments");
                router.refresh();
            }
        }
    }, [state, onSuccess, router]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <div className="w-full bg-card text-card-foreground rounded-xl border border-border/60 shadow-sm p-6 sm:p-8 transition-all">
            <form onSubmit={handleSubmit} className="space-y-6">
                {department && (
                    <input type="hidden" name="id" value={department.id} />
                )}

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="name"
                            className="text-sm font-medium flex items-center gap-1"
                        >
                            Nome do Departamento{" "}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Ex: Recursos Humanos, Tecnologia da Informação"
                            defaultValue={department?.name || ""}
                            disabled={isPending}
                            autoFocus
                            className={
                                state?.fieldErrors?.name
                                    ? "border-destructive focus-visible:ring-destructive"
                                    : ""
                            }
                        />
                        <FieldError errors={state?.fieldErrors?.name} />
                    </div>
                </div>

                {/* Banner de Erro Global */}
                {state?.error && (
                    <div className="flex items-start gap-3 text-destructive text-sm p-3.5 bg-destructive/10 rounded-lg border border-destructive/20 animate-in fade-in-50 duration-200">
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{state.error}</span>
                    </div>
                )}

                {/* Ações / Rodapé do Form */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                    )}

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full sm:w-auto min-w-35 gap-2 shadow-xs"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Salvando...</span>
                            </>
                        ) : isEditing ? (
                            <>
                                <Save className="h-4 w-4" />
                                <span>Salvar Alterações</span>
                            </>
                        ) : (
                            <>
                                <Plus className="h-4 w-4" />
                                <span>Cadastrar</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};
