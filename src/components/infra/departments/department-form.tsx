"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { upsertDepartmentAction } from "@/actions/departments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/users/field-error";
import { Department } from "@/types/department";

type Props = {
    department?: Department;
    onSuccess?: (newId: string) => void;
};

type ActionState = {
    error: string;
    fieldErrors: Record<string, string[]>;
    data?: { id: string }; // 🌟 Adicionado para capturar o ID retornado pela Server Action
};

const initialState: ActionState = {
    error: "",
    fieldErrors: {},
};

export const DepartmentForm = ({ department, onSuccess }: Props) => {
    const router = useRouter();
    const [state, action, isPending] = useActionState(
        upsertDepartmentAction,
        initialState,
    );

    // 🎯 Captura o sucesso da Server Action de forma robusta
    useEffect(() => {
        console.log("=== [DEBUG MODAL] Mudança de Estado capturada ===");
        console.log("State atual:", state);
        console.log("onSuccess existe?", !!onSuccess);

        const hasId = !!state?.data?.id;
        const hasErrors =
            !!state?.error ||
            (state?.fieldErrors && Object.keys(state.fieldErrors).length > 0);

        if (hasId && !hasErrors) {
            const novoId = String(state.data!.id);
            console.log(
                "🚀 Sucesso! Enviando este ID para o Combobox:",
                novoId,
            );
            if (onSuccess) {
                // Fluxo do Modal: Passa o ID gerado para o pai e fecha
                onSuccess(novoId);
            } else {
                // Fluxo de Página cheia: Força o redirecionamento nativo do navegador
                // usando o router.push combinado com o window.location para limpar o cache pesado
                console.log("Redirecionando rota de página cheia...");
                router.push("/infra/departments");
                router.refresh();
            }
        } else if (hasErrors) {
            console.error(
                "❌ Ação executou mas retornou erros:",
                state?.error,
                state?.fieldErrors,
            );
        }
    }, [state, onSuccess, router]);

    return (
        <div className="w-full bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
            <form action={action} className="space-y-6">
                {department && (
                    <input type="hidden" name="id" value={department.id} />
                )}

                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="name"
                            className="flex items-center gap-1"
                        >
                            Nome do Departamento{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Ex: Recursos Humanos, Tecnologia da Informação"
                            defaultValue={department?.name || ""}
                            required
                        />
                        <FieldError errors={state?.fieldErrors?.name} />
                    </div>
                </div>

                {state?.error && (
                    <div className="text-destructive text-sm p-3 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-900/50">
                        {state.error}
                    </div>
                )}

                <div className="flex items-center gap-3 border-t pt-4">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full sm:w-auto"
                    >
                        {isPending
                            ? "Salvando..."
                            : department
                              ? "Salvar Alterações"
                              : "Cadastrar Departamento"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
