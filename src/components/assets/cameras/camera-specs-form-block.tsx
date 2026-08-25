"use client";

import { Camera, Hash, Tag } from "lucide-react";
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

interface CameraSpecsFormBlockProps<TFieldValues extends FieldValues> {
    control: Control<TFieldValues>;
    disabled?: boolean;
}

export function CameraSpecsFormBlock<TFieldValues extends FieldValues>({
    control,
    disabled = false,
}: CameraSpecsFormBlockProps<TFieldValues>) {
    return (
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-900">
                <Camera
                    className="text-blue-600 dark:text-blue-400"
                    size={18}
                />
                <div>
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                        Especificações da Câmera / DVR
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Informe o identificador, modelo, canal e dados de rede
                        física
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
                                Hostname / Identificador{" "}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: CAM-ENTRADA-01"
                                    className="h-9 text-xs font-mono bg-zinc-50/50 dark:bg-zinc-900/50"
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
                                Modelo da Câmera{" "}
                                <span className="text-rose-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: Intelbras VIP 1230 B"
                                    className="h-9 text-xs bg-zinc-50/50 dark:bg-zinc-900/50"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* Canal no DVR/NVR */}
                <FormField
                    control={control}
                    name={"channel" as Path<TFieldValues>}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                <Hash size={13} className="text-zinc-400" />{" "}
                                Canal DVR/NVR
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    min={1}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: 1"
                                    className="h-9 text-xs font-mono bg-zinc-50/50 dark:bg-zinc-900/50"
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
                                    placeholder="Ex: SN-CAM-00064"
                                    className="h-9 text-xs font-mono uppercase bg-zinc-50/50 dark:bg-zinc-900/50"
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
                            <FormLabel className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                                <Tag size={13} /> Endereço MAC (Físico)
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value || ""}
                                    disabled={disabled}
                                    placeholder="Ex: 00:1B:44:11:33:40"
                                    className="h-9 text-xs font-mono uppercase bg-zinc-50/50 dark:bg-zinc-900/50 border-blue-200 dark:border-blue-900/40"
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
                                    placeholder="Ângulo de visão, ponto de montagem ou observações de manutenção..."
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
