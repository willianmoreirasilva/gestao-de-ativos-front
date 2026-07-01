"use client";

import { Monitor } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/users/field-error";

export function ComputerHardwareFields({ form }: { form: UseFormReturn<any> }) {
    return (
        <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3 mb-5">
                <div className="p-1.5 bg-zinc-50 dark:bg-zinc-900 rounded-md text-zinc-700 dark:text-zinc-400">
                    <Monitor size={16} />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        Especificações do Computador
                    </h2>
                    <p className="text-[11px] text-zinc-500">
                        Informações operacionais e componentes de hardware
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="computer.hostname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold">
                                Nome da Máquina (Hostname)
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: CP-TI-04" {...field} />
                            </FormControl>
                            <FieldError
                                errors={
                                    form.formState.errors.computer?.hostname
                                        ?.message
                                        ? [
                                              form.formState.errors.computer
                                                  .hostname.message,
                                          ]
                                        : undefined
                                }
                            />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="computer.username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold">
                                Usuário Utilizador
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ex: joao.silva"
                                    {...field}
                                />
                            </FormControl>
                            <FieldError
                                errors={
                                    form.formState.errors.computer?.username
                                        ?.message
                                        ? [
                                              form.formState.errors.computer
                                                  .username.message,
                                          ]
                                        : undefined
                                }
                            />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="computer.processor"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold">
                                Processador
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ex: Intel Core i5 12th Gen"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="computer.memory"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold">
                                Memória RAM
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: 16GB DDR4" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="computer.disk"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold">
                                Armazenamento / Disco
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ex: SSD 512GB NVMe"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="computer.os"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold">
                                Sistema Operacional
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ex: Windows 11 Pro"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
