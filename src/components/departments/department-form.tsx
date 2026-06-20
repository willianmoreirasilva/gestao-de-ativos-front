"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { upsertDepartmentAction } from "../../actions/departments";
import { FieldError } from "../../components/users/field-error";
import { Department } from "@/types/department";

type Props = {
    department?: Department;
};

type ActionState = {
    error: string;
    fieldErrors: Record<string, string[]>;
};

const initialState: ActionState = {
    error: "",
    fieldErrors: {},
};

export const DepartmentForm = ({ department }: Props) => {
    const [state, action, isPending] = useActionState(
        upsertDepartmentAction,
        initialState,
    );

    return (
        <div className="w-full bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
            <form action={action} className="space-y-6">
                {/* ID oculto essencial para o fluxo de Edição (Upsert) */}
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

                {/* Banner de erro geral vindo da API backend */}
                {state?.error && (
                    <div className="text-destructive text-sm p-3 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-900/50">
                        {state.error}
                    </div>
                )}

                {/* Botões de Ação alinhados com o design global */}
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