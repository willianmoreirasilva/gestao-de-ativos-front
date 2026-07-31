"use client";

import { Building2, MapPin, Tag, User } from "lucide-react";
import { Control, FieldValues, Path } from "react-hook-form";

import { ComboboxSearch } from "@/components/ui/combobox-search";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/users/field-error";
import { OptionItem } from "@/types/assets";

interface AllocationFormBlockProps<
    TFieldValues extends FieldValues = FieldValues,
> {
    control: Control<TFieldValues>;
    options?: {
        departments?: OptionItem[];
        units?: OptionItem[];
        users?: OptionItem[];
    };
    disabled?: boolean;
}

export function AllocationFormBlock<
    TFieldValues extends FieldValues = FieldValues,
>({
    control,
    options,
    disabled = false,
}: AllocationFormBlockProps<TFieldValues>) {
    const safeDepartments = options?.departments ?? [];
    const safeLocations = options?.units ?? [];

    return (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm space-y-4">
            {/* Cabeçalho do Card */}
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-900">
                <Building2 className="text-purple-500" size={18} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                    Alocação de Infraestrutura e Responsabilidade
                </h3>
            </div>

            {/* Grid com os campos de alocação */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Campo: Código de Patrimônio */}
                <FormField
                    control={control}
                    name={"patrimony" as Path<TFieldValues>}
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                <Tag size={14} className="text-zinc-400" />
                                Código do Patrimônio
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    placeholder="Ex: PAT-2026-8832"
                                    disabled={disabled}
                                    className="h-9 text-xs uppercase tracking-wider font-mono bg-zinc-50/50 dark:bg-zinc-900/50"
                                />
                            </FormControl>
                            <FieldError
                                errors={
                                    fieldState.error?.message
                                        ? [fieldState.error.message]
                                        : undefined
                                }
                            />
                        </FormItem>
                    )}
                />

                {/* Campo: Usuário Responsável */}
                <FormField
                    control={control}
                    name={"username" as Path<TFieldValues>}
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                <User size={14} className="text-zinc-400" />
                                Usuário Responsável
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    placeholder="Ex: João Silva ou operador"
                                    disabled={disabled}
                                    className="h-9 text-xs font-medium bg-zinc-50/50 dark:bg-zinc-900/50"
                                />
                            </FormControl>
                            <FieldError
                                errors={
                                    fieldState.error?.message
                                        ? [fieldState.error.message]
                                        : undefined
                                }
                            />
                        </FormItem>
                    )}
                />

                {/* Campo: Departamento / Setor */}
                <FormField
                    control={control}
                    name={"departmentId" as Path<TFieldValues>}
                    render={({ field, fieldState }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                <Building2
                                    size={14}
                                    className="text-zinc-400"
                                />
                                <span>Departamento / Setor Destino</span>
                                <span className="text-[10px] text-zinc-400 font-normal lowercase">
                                    (opcional se tiver localidade)
                                </span>
                            </FormLabel>
                            <ComboboxSearch
                                options={safeDepartments}
                                value={field.value || ""}
                                onChange={(val) => field.onChange(val || "")}
                                placeholder="Selecionar departamento..."
                                disabled={disabled}
                            />
                            <FieldError
                                errors={
                                    fieldState.error?.message
                                        ? [fieldState.error.message]
                                        : undefined
                                }
                            />
                        </FormItem>
                    )}
                />

                {/* Campo: Localidade Principal / Unidade */}
                <FormField
                    control={control}
                    name={"unitId" as Path<TFieldValues>}
                    render={({ field, fieldState }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                <MapPin size={14} className="text-zinc-400" />
                                <span>Localidade Física Principal</span>
                                <span className="text-[10px] text-zinc-400 font-normal lowercase">
                                    (opcional se tiver departamento)
                                </span>
                            </FormLabel>
                            <ComboboxSearch
                                options={safeLocations}
                                value={field.value || ""}
                                onChange={(val) => field.onChange(val || "")}
                                placeholder="Selecionar localidade..."
                                disabled={disabled}
                            />
                            <FieldError
                                errors={
                                    fieldState.error?.message
                                        ? [fieldState.error.message]
                                        : undefined
                                }
                            />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
