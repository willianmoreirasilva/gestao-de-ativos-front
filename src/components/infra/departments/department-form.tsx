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

    // 🎯 Captura o sucesso da Server Action
    useEffect(() => {
        // Se a action executou, não há erros e retornou os dados/id
        if (state?.data?.id && !state.error && Object.keys(state.fieldErrors).length === 0) {
            if (onSuccess) {
                onSuccess(state.data.id); // Fluxo do Modal: Passa o ID e fecha
            } else {
                router.push("/infra/departments"); // Fluxo de Página cheia: Redireciona
                router.refresh();
            }
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
                        <Label htmlFor="name" className="flex items-center gap-1">
                            Nome do Departamento <span className="text-red-500">*</span>
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
                    <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
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