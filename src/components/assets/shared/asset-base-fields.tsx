"use client";

import { UseFormReturn } from "react-hook-form";

// Importações dos seus formulários existentes
import { DepartmentForm } from "@/components/infra/departments/department-form";
import { LocationForm } from "@/components/infra/locations/location-form";
import { ComboboxCreateNew } from "@/components/ui/combobox-create-new";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdateAssetInput } from "@/schemas/assets";

interface AssetBaseFieldsProps {
  form: UseFormReturn<UpdateAssetInput>;
  departments: any;
  locations: any;
}

export function AssetBaseFields({
  form,
  departments,
  locations,
}: AssetBaseFieldsProps) {
  const listDepartments = Array.isArray(departments)
    ? departments
    : departments?.data || [];
  const listLocations = Array.isArray(locations)
    ? locations
    : locations?.data || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-6 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-sm">
      <div className="col-span-1 md:col-span-3 pb-1 border-b border-zinc-100 dark:border-zinc-900---">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          Informações Patrimoniais
        </h3>
        <p className="text-xs text-zinc-500">
          Dados de tombamento corporativo e vinculação de espaço.
        </p>
      </div>

      {/* Campo Nº Patrimônio */}
      <FormField
        control={form.control}
        name="patrimony"
        render={({ field }) => (
          <FormItem className="flex flex-col justify-end">
            <FormLabel className="text-xs font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">
              Nº Patrimônio
            </FormLabel>
            <Input placeholder="Ex: PAT-001234" {...field} className="h-10" />
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      {/* Combobox Moderno de Departamento */}
      <FormField
        control={form.control}
        name="departmentId"
        render={({ field }) => (
          <FormItem className="flex flex-col justify-end">
            <FormLabel className="text-xs font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">
              Departamento
            </FormLabel>
            <ComboboxCreateNew
              options={listDepartments}
              value={field.value || ""}
              onChange={field.onChange}
              placeholder="Selecionar departamento..."
              searchPlaceholder="Digitar iniciais..."
              emptyMessage="Nenhum departamento cadastrado."
              createLabel="Adicionar Novo Departamento"
              modalTitle="Criar Departamento"
              modalDescription="O novo departamento ficará disponível instantaneamente para este ativo."
              createForm={(onSuccess) => (
                <DepartmentForm onSuccess={(id) => onSuccess(id)} />
              )}
            />
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      {/* Combobox Moderno de Localização */}
      <FormField
        control={form.control}
        name="locationId"
        render={({ field }) => (
          <FormItem className="flex flex-col justify-end">
            <FormLabel className="text-xs font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">
              Localidade / Filial
            </FormLabel>
            <ComboboxCreateNew
              options={listLocations}
              value={field.value || ""}
              onChange={field.onChange}
              placeholder="Selecionar localidade..."
              searchPlaceholder="Digitar iniciais..."
              emptyMessage="Nenhuma localidade cadastrada."
              createLabel="Cadastrar Nova Localidade"
              modalTitle="Criar Localidade / Filial"
              modalDescription="Insira os dados geográficos ou salas para vincular ao ativo."
              createForm={(onSuccess) => (
                <LocationForm onSuccess={(id) => onSuccess(id)} />
              )}
            />
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
}
