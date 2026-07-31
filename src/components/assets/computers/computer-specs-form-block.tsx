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
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm space-y-4">
            {/* Cabeçalho do Card */}
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-900">
                <Monitor className="text-emerald-500" size={18} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                    Especificações do Sistema & Hardware
                </h3>
            </div>

            {/* Grid dos campos principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    placeholder="Ex: WS-FIN-001"
                                    disabled={disabled}
                                    className="h-9 text-xs font-mono bg-zinc-50/50 dark:bg-zinc-900/50"
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
                                Memória RAM
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value || ""}
                                disabled={disabled}
                            >
                                <FormControl>
                                    <SelectTrigger className="h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/50">
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

                {/* Endereço MAC */}
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
                                    placeholder="Ex: 00:1A:3F:F1:4C:C2"
                                    disabled={disabled}
                                    className="h-9 text-xs font-mono uppercase bg-zinc-50/50 dark:bg-zinc-900/50"
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

            {/* Notas e Observações */}
            <FormField
                control={control}
                name={"notes" as Path<TFieldValues>}
                render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center justify-between pt-1">
                            <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                Observações do Ativo
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
                                    className="h-6 px-2 text-[10px] text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1"
                                >
                                    <Trash2 size={12} /> Excluir nota
                                </Button>
                            )}
                        </div>
                        <FormControl>
                            <Textarea
                                placeholder="Adicione anotações técnicas sobre este computador..."
                                className="text-xs min-h-17.5 resize-none bg-zinc-50/50 dark:bg-zinc-900/50"
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
