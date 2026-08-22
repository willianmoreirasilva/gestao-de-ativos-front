"use client";

import { Hash, PhoneCall, Tag } from "lucide-react";
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

interface PhoneSpecsFormBlockProps<TFieldValues extends FieldValues> {
    control: Control<TFieldValues>;
    disabled?: boolean;
}

export function PhoneSpecsFormBlock<TFieldValues extends FieldValues>({
    control,
    disabled = false,
}: PhoneSpecsFormBlockProps<TFieldValues>) {
    return (
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-900">
                <PhoneCall
                    className="text-blue-600 dark:text-blue-400"
                    size={18}
                />
                <div>
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                        Especificações do Telefone / Ramal
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Informe o hostname do dispositivo, ramal, modelo e
                        observações
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hostname */}
                <FormField
                    control={control}
                    name={"hostname" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                <Tag size={13} className="text-zinc-400" />{" "}
                                Hostname / Nome na Rede
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: TEL-FINANCEIRO-01"
                                    className="h-9 text-xs font-mono uppercase bg-zinc-50/50 dark:bg-zinc-900/50"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Número do Ramal / Telefone */}
                <FormField
                    control={control}
                    name={"phoneNumber" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                                <Hash size={13} /> Ramal / Número{" "}
                                <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: 4131"
                                    className="h-9 text-xs font-mono bg-zinc-50/50 dark:bg-zinc-900/50 border-blue-200 dark:border-blue-900/40"
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
                        <FormItem className="md:col-span-2">
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                Modelo do Aparelho
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: Intelbras TIP 125 Lite / Grandstream GXP1625"
                                    className="h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/50"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Observações Gerais */}
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
                                    placeholder="Configurações de SIP, senha da conta, atalhos..."
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
