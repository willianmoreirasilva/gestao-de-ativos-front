"use client";

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

export const DepartmentForm = ({ department, onSuccess }: Props) => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    upsertDepartmentAction,
    initialState,
  );

  // 🎯 Captura o sucesso da Server Action de forma robusta
  useEffect(() => {
    const hasId = !!state?.data?.id;
    const hasErrors =
      !!state?.error ||
      (state?.fieldErrors && Object.keys(state.fieldErrors).length > 0);

    if (hasId && !hasErrors) {
      const novoId = String(state.data!.id);

      if (onSuccess) {
        onSuccess(novoId); // Se for modal, passa o ID limpo pro Combobox
      } else {
        router.push("/infra/departments"); // Se for página cheia, redireciona
        router.refresh();
      }
    }
  }, [state, onSuccess, router]);

  // 🌟 INTERCEPTADOR CRUCIAL: Controla o envio via transição isolada do React 19
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Dispara a action de forma atômica, forçando o retorno do objeto completo
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
      {/* Trocamos action={action} pelo onSubmit controlado */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {department && <input type="hidden" name="id" value={department.id} />}

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
          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto"
            onClick={(e) => {
              // 🌟 ISSO AQUI EVITA QUE O FORMULÁRIO DO COMPUTADOR SEJA ENVIADO JUNTO!
              e.stopPropagation();
            }}
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
