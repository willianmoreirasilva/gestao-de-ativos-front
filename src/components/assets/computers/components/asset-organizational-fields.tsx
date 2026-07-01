"use client";

import { ShieldAlert } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { DepartmentForm } from "@/components/infra/departments/department-form";
import { LocationForm } from "@/components/infra/locations/location-form";
import { ComboboxCreateNew } from "@/components/ui/combobox-create-new";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function AssetOrganizationalFields({
    form,
    departments,
    locations,
}: {
    form: UseFormReturn<any>;
    departments: any;
    locations: any;
}) {
    const listDepartments = Array.isArray(departments)
        ? departments
        : departments?.data || [];
    const listLocations = Array.isArray(locations)
        ? locations
        : locations?.data || [];

    return (
        <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3">
                <div className="p-1.5 bg-zinc-50 dark:bg-zinc-900 rounded-md text-zinc-700 dark:text-zinc-400">
                    <ShieldAlert size={16} />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        Vínculos & Identificação
                    </h2>
                </div>
            </div>

            <FormField
                control={form.control}
                name="patrimony"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs font-semibold">
                            Código de Patrimônio
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: PAT-0982" {...field} />
                        </FormControl>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel className="text-xs font-semibold mb-1">
                            Departamento
                        </FormLabel>
                        <ComboboxCreateNew
                            options={listDepartments}
                            value={field.value || ""}
                            onChange={(val) => {
                                field.onChange(val);
                                if (val) form.clearErrors("departmentId");
                            }}
                            placeholder="Selecionar departamento..."
                            createLabel="Cadastrar Novo Departamento"
                            modalTitle="Novo Departamento"
                            modalDescription="Adicione um departamento sob demanda para a infraestrutura."
                            createForm={(onSuccess) => (
                                <DepartmentForm onSuccess={onSuccess} />
                            )}
                        />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="locationId"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel className="text-xs font-semibold mb-1">
                            Localidade / Filial
                        </FormLabel>
                        <ComboboxCreateNew
                            options={listLocations}
                            value={field.value || ""}
                            onChange={(val) => {
                                field.onChange(val);
                                if (val) form.clearErrors("locationId");
                            }}
                            placeholder="Selecionar localidade..."
                            createLabel="Cadastrar Nova Localidade"
                            modalTitle="Nova Localidade"
                            modalDescription="Adicione uma filial ou sala sob demanda."
                            createForm={(onSuccess) => (
                                <LocationForm onSuccess={onSuccess} />
                            )}
                        />
                    </FormItem>
                )}
            />
        </div>
    );
}
