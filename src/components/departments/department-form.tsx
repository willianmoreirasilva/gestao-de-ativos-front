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
        <div className="p-4 max-w-2xl">
            <form action={action} className="space-y-6">
                {department && (
                    <input type="hidden" name="id" value={department.id} />
                )}

                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome do Departamento</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={department?.name || ""}
                            placeholder="Nome do departamento"
                            required
                        />
                        <FieldError errors={state?.fieldErrors?.name} />
                    </div>
                </div>

                {state?.error && (
                    <div className="text-destructive text-sm p-2 bg-red-50 rounded">
                        {state.error}
                    </div>
                )}

                <Button type="submit" disabled={isPending}>
                    {isPending
                        ? "Salvando..."
                        : department
                          ? "Salvar Alterações"
                          : "Adicionar Departamento"}
                </Button>
            </form>
        </div>
    );
};
