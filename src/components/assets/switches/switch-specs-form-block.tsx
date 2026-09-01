"use client";

import { Hash, Layers, Network, Tag } from "lucide-react";
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

interface SwitchSpecsFormBlockProps<TFieldValues extends FieldValues> {
    control: Control<TFieldValues>;
    disabled?: boolean;
}

export function SwitchSpecsFormBlock<TFieldValues extends FieldValues>({
    control,
    disabled = false,
}: SwitchSpecsFormBlockProps<TFieldValues>) {
    return (
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-900">
                <Network
                    className="text-emerald-600 dark:text-emerald-400"
                    size={18}
                />
                <div>
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                        Especificações do Switch
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Informe o hostname, fabricante, modelo e total de portas
                        físicas
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hostname / Identificador */}
                <FormField
                    control={control}
                    name={"hostname" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                Hostname / Identificador
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: SW-CORE-01"
                                    className="h-9 text-xs font-mono bg-zinc-50/50 dark:bg-zinc-900/50"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Fabricante / Vendor */}
                <FormField
                    control={control}
                    name={"vendor" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                <Layers size={13} className="text-zinc-400" />{" "}
                                Fabricante (Vendor)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: Cisco, Ubiquiti, Mikrotik"
                                    className="h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/50"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Modelo */}
                <FormField
                    control={control}
                    name={"model" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                Modelo do Equipamento{" "}
                                <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: CBS350-24T-4G"
                                    className="h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/50"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Total de Portas */}
                <FormField
                    control={control}
                    name={"totalPorts" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                <Hash size={13} className="text-zinc-400" />{" "}
                                Total de Portas
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    min={1}
                                    value={field.value ?? 24}
                                    disabled={disabled}
                                    placeholder="Ex: 24"
                                    className="h-9 text-xs font-mono bg-zinc-50/50 dark:bg-zinc-900/50"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Endereço MAC */}
                <FormField
                    control={control}
                    name={"mac" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                <Tag size={13} /> Endereço MAC (Físico)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: 00:1B:44:11:33:40"
                                    className="h-9 text-xs font-mono uppercase bg-zinc-50/50 dark:bg-zinc-900/50 border-emerald-200 dark:border-emerald-900/40"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Observações */}
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
                                    placeholder="Porta de uplink, versão do firmware ou localização no rack..."
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
