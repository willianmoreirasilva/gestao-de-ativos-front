"use client";

import { Hash, Printer as PrinterIcon, Tag } from "lucide-react";
import { Control, FieldValues, Path } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PrinterSpecsFormBlockProps<TFieldValues extends FieldValues> {
    control: Control<TFieldValues>;
    disabled?: boolean;
}

export function PrinterSpecsFormBlock<TFieldValues extends FieldValues>({
    control,
    disabled = false,
}: PrinterSpecsFormBlockProps<TFieldValues>) {
    return (
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-900">
                <PrinterIcon
                    className="text-purple-600 dark:text-purple-400"
                    size={18}
                />
                <div>
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                        Especificações da Impressora
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Informe o modelo, número de série e o código para
                        abertura de chamados
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Modelo */}
                <FormField
                    control={control}
                    name={"model" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                Modelo da Impressora{" "}
                                <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: Kyocera Ecosys M3655"
                                    className="h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/50"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Número de Série */}
                <FormField
                    control={control}
                    name={"serial" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                <Tag size={13} className="text-zinc-400" /> Nº
                                de Série
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: KYOS-00329"
                                    className="h-9 text-xs font-mono uppercase bg-zinc-50/50 dark:bg-zinc-900/50"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Código de Chamado (Outsourcing) */}
                <FormField
                    control={control}
                    name={"code" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                                <Hash size={13} /> Código de Chamado
                                (Outsourcing)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: COD-PRT-00329"
                                    className="h-9 text-xs font-mono bg-zinc-50/50 dark:bg-zinc-900/50 border-purple-200 dark:border-purple-900/40"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Notas / Observações */}
                <FormField
                    control={control}
                    name={"notes" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                Observações Gerais
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Histórico, suprimentos ou detalhes contratuais..."
                                    className="text-xs min-h-20 resize-none bg-zinc-50/50 dark:bg-zinc-900/50"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
