"use client";

import { Cpu, HardDrive, Laptop, Monitor, Trash2 } from "lucide-react";
import {
    Control,
    FieldValues,
    Path,
    UseFormSetValue,
    useWatch,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ComboboxSearch } from "@/components/ui/combobox-search";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/users/field-error";
import { OptionItem } from "@/types/assets";

interface ComputerSpecsFormBlockProps<TFieldValues extends FieldValues> {
    control: Control<TFieldValues>;
    setValue: UseFormSetValue<TFieldValues>;
    options: {
        processors: OptionItem[];
        operatingSystems: OptionItem[];
        disks: OptionItem[];
    };
    disabled?: boolean;
}

export function ComputerSpecsFormBlock<TFieldValues extends FieldValues>({
    control,
    setValue,
    options,
    disabled = false,
}: ComputerSpecsFormBlockProps<TFieldValues>) {
    const notesValue = useWatch({
        control,
        name: "notes" as Path<TFieldValues>,
    });

    return (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-sm space-y-3">
            {/* Cabeçalho do Card */}
            <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-100 dark:border-zinc-900">
                <Monitor className="text-emerald-500" size={16} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                    Especificações do Sistema & Hardware
                </h3>
            </div>

            {/* Grid de 2 Colunas (Perfeitamente alinhado) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Sistema Operacional */}
                <FormField
                    control={control}
                    name={"osId" as Path<TFieldValues>}
                    render={({ field, fieldState }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                Sistema Operacional
                            </FormLabel>
                            <ComboboxSearch
                                options={options.operatingSystems}
                                value={field.value || ""}
                                onChange={(val) => field.onChange(val || "")}
                                placeholder="Selecionar sistema operacional..."
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

                {/* Hostname */}
                <FormField
                    control={control}
                    name={"hostname" as Path<TFieldValues>}
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                Hostname Interno *
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    placeholder="Ex: WS-ACAD-00319"
                                    disabled={disabled}
                                    className="h-8 text-xs font-mono bg-zinc-50/50 dark:bg-zinc-900/50"
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

                {/* Processador (CPU) */}
                <FormField
                    control={control}
                    name={"processorId" as Path<TFieldValues>}
                    render={({ field, fieldState }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                <Cpu size={14} className="text-zinc-400" />
                                Processador (CPU)
                            </FormLabel>
                            <ComboboxSearch
                                options={options.processors}
                                value={field.value || ""}
                                onChange={(val) => field.onChange(val || "")}
                                placeholder="Selecionar processador..."
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

                {/* Memória RAM */}
                <FormField
                    control={control}
                    name={"memory" as Path<TFieldValues>}
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                <Laptop size={14} className="text-zinc-400" />
                                Memória RAM Instalada
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value || ""}
                                disabled={disabled}
                            >
                                <FormControl>
                                    <SelectTrigger className="h-8 text-xs bg-zinc-50/50 dark:bg-zinc-900/50">
                                        <SelectValue placeholder="Selecionar RAM" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem
                                        value=""
                                        className="text-xs text-muted-foreground italic"
                                    >
                                        Nenhuma selecionada
                                    </SelectItem>
                                    {[
                                        "1GB",
                                        "2GB",
                                        "4GB",
                                        "8GB",
                                        "12GB",
                                        "16GB",
                                        "32GB",
                                        "64GB",
                                        "128GB",
                                    ].map((m) => (
                                        <SelectItem
                                            key={m}
                                            value={m}
                                            className="text-xs"
                                        >
                                            {m}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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

                {/* Armazenamento (Disco) */}
                <FormField
                    control={control}
                    name={"diskId" as Path<TFieldValues>}
                    render={({ field, fieldState }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                <HardDrive
                                    size={14}
                                    className="text-zinc-400"
                                />
                                Armazenamento (Disco)
                            </FormLabel>
                            <ComboboxSearch
                                options={options.disks}
                                value={field.value || ""}
                                onChange={(val) => field.onChange(val || "")}
                                placeholder="Selecionar disco..."
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

                {/* Código AnyDesk */}
                <FormField
                    control={control}
                    name={"anydesk" as Path<TFieldValues>}
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-bold text-rose-500 dark:text-rose-400 flex items-center gap-1.5">
                                Código AnyDesk
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: 627 684 640"
                                    className="h-8 text-xs font-mono bg-zinc-50/50 dark:bg-zinc-900/50"
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

                {/* Endereço MAC Físico (Span 2 para preencher toda a largura se for ímpar) */}
                <div className="md:col-span-2">
                    <FormField
                        control={control}
                        name={"mac" as Path<TFieldValues>}
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                    Endereço MAC Físico
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value || ""}
                                        placeholder="Ex: 00:1B:44:11:33:40"
                                        disabled={disabled}
                                        className="h-8 text-xs font-mono uppercase bg-zinc-50/50 dark:bg-zinc-900/50"
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
                </div>
            </div>

            {/* Notas e Observações */}
            <FormField
                control={control}
                name={"notes" as Path<TFieldValues>}
                render={({ field }) => (
                    <FormItem className="pt-1">
                        <div className="flex items-center justify-between">
                            <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                Notas e Observações
                            </FormLabel>
                            {notesValue && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() =>
                                        setValue(
                                            "notes" as Path<TFieldValues>,
                                            "" as any,
                                        )
                                    }
                                    className="h-5 px-1.5 text-[10px] text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1"
                                >
                                    <Trash2 size={11} /> Excluir nota
                                </Button>
                            )}
                        </div>
                        <FormControl>
                            <Textarea
                                placeholder="Adicione anotações técnicas sobre este computador..."
                                className="text-xs h-14 min-h-14 resize-none bg-zinc-50/50 dark:bg-zinc-900/50 py-1.5"
                                disabled={disabled}
                                {...field}
                                value={field.value || ""}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>
    );
}
