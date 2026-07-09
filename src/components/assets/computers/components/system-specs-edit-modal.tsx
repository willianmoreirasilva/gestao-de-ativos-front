"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Cpu, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { updateAssetAction } from "@/actions/assets";
import { Button } from "@/components/ui/button";
import { ComboboxSearch } from "@/components/ui/combobox-search";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
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
import { FieldError } from "@/components/users/field-error"; // 🌟 Seu componente padrão
import { ComputerDetails, SystemSpecsModalOptions } from "@/types/assets";

// 1. Adicione a mesma Regex do back no topo do seu modal
const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

const systemSpecsSchema = z.object({
    computer: z.object({
        hostname: z.string().min(1, "Hostname obrigatório"),
        username: z.string().min(1, "Usuário obrigatório"),
        // Permite passar string vazia no estado local do form
        processorId: z.string().uuid().or(z.literal("")).nullable().optional(),
        osId: z.string().uuid().or(z.literal("")).nullable().optional(),
        diskId: z.string().uuid().or(z.literal("")).nullable().optional(),
        memory: z.string().nullable().optional(),
        mac: z
            .string()
            .nullable()
            .optional()
            .refine((val) => !val || val.trim() === "" || macRegex.test(val), {
                message: "Formato de MAC inválido. Use Ex: 00:1A:3F:F1:4C:C2",
            }),
    }),
});

type SystemSpecsValues = z.infer<typeof systemSpecsSchema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    assetId: string;
    computer?: ComputerDetails | null;
    options: SystemSpecsModalOptions;
}

export function SystemSpecsEditModal({
    isOpen,
    onClose,
    assetId,
    computer,
    options,
}: Props) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null); // 🌟 Captura erros gerais da API

    const form = useForm<SystemSpecsValues>({
        resolver: zodResolver(systemSpecsSchema),
        defaultValues: {
            computer: {
                hostname: computer?.hostname || "",
                username: computer?.username || "",
                processorId: computer?.processor?.id || "",
                osId: computer?.operatingSystem?.id || "",
                diskId: computer?.disk?.id || "",
                memory: computer?.memory || "",
                mac: computer?.mac || "",
            },
        },
    });

    useEffect(() => {
        if (isOpen) {
            setApiError(null);
            form.reset({
                computer: {
                    hostname: computer?.hostname || "",
                    username: computer?.username || "",
                    processorId: computer?.processor?.id || "",
                    osId: computer?.operatingSystem?.id || "",
                    diskId: computer?.disk?.id || "",
                    memory: computer?.memory || "",
                    mac: computer?.mac || "",
                },
            });
        }
    }, [isOpen, computer, form]);

    // Limpa o erro geral da API ao clicar em qualquer input ou interagir com o form
    const handleFormInteraction = () => {
        if (apiError) setApiError(null);
    };

    const onSubmit = async (data: SystemSpecsValues) => {
        setIsPending(true);
        setApiError(null);
        // 🌟 CLONAR E TRATAR PAYLOAD: Se o MAC ou a memória forem strings vazias, envia null para a API
        const sanitizedData = {
            ...data,
            computer: {
                ...data.computer,
                // Se o usuário apagou o campo (ficou ""), vira null. Caso contrário, mantém o valor ou limpa espaços
                mac:
                    data.computer.mac?.trim() === ""
                        ? null
                        : data.computer.mac?.trim(),
                memory:
                    data.computer.memory === "" ? null : data.computer.memory,
                processorId:
                    data.computer.processorId === ""
                        ? null
                        : data.computer.processorId,
                diskId:
                    data.computer.diskId === "" ? null : data.computer.diskId,
                osId: data.computer.osId === "" ? null : data.computer.osId,
            },
        };

        // Passamos o payload limpo e sanitizado para a Server Action
        const result = await updateAssetAction(assetId, sanitizedData as any);

        if (result.success) {
            router.refresh();
            onClose();
        } else {
            // Se a API retornar erros nos campos, tenta mapear
            if (result.fieldErrors) {
                Object.entries(result.fieldErrors).forEach(
                    ([key, messages]) => {
                        if (key.startsWith("computer.")) {
                            form.setError(key as any, {
                                type: "server",
                                message: messages[0],
                            });
                        } else if (
                            ["mac", "hostname", "username", "memory"].includes(
                                key,
                            )
                        ) {
                            form.setError(`computer.${key}` as any, {
                                type: "server",
                                message: messages[0],
                            });
                        } else {
                            form.setError(key as any, {
                                type: "server",
                                message: messages[0],
                            });
                        }
                    },
                );
            }

            // 🌟 Independente de vir em fieldErrors ou string pura, guardamos o texto do erro aqui
            setApiError(
                result.error ||
                    "Erro ao salvar especificações. Verifique os dados.",
            );
        }
        setIsPending(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-[480px] bg-white dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-visible">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
                        <Cpu className="text-emerald-500" size={18} /> Editar
                        Hardware e Sistema
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Modifique as configurações de sistema da máquina.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        onChange={handleFormInteraction} // 🌟 Limpa o erro ao digitar em qualquer lugar
                        className="space-y-4 pt-2"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="computer.hostname"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                            Hostname
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="h-9 text-xs"
                                                onFocus={() =>
                                                    form.clearErrors(
                                                        "computer.hostname",
                                                    )
                                                }
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
                            <FormField
                                control={form.control}
                                name="computer.username"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                            Usuário
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="h-9 text-xs"
                                                onFocus={() =>
                                                    form.clearErrors(
                                                        "computer.username",
                                                    )
                                                }
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

                        <FormField
                            control={form.control}
                            name="computer.processorId"
                            render={({ field, fieldState }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                        Processador (CPU)
                                    </FormLabel>
                                    <div
                                        onClick={() => {
                                            form.clearErrors(
                                                "computer.processorId",
                                            );
                                            handleFormInteraction();
                                        }}
                                    >
                                        <ComboboxSearch
                                            options={options.processors}
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            placeholder="Filtrar e selecionar processador..."
                                        />
                                    </div>
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

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="computer.memory"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                            Memória RAM
                                        </FormLabel>
                                        <Select
                                            onValueChange={(val) => {
                                                field.onChange(val);
                                                form.clearErrors(
                                                    "computer.memory",
                                                );
                                                handleFormInteraction();
                                            }}
                                            value={field.value || ""}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-9 text-xs">
                                                    <SelectValue placeholder="Capacidade" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {/* 🌟 Opção adicionada para permitir desvincular ou deixar em branco */}
                                                <SelectItem
                                                    value=""
                                                    className="text-xs text-muted-foreground italic font-medium"
                                                >
                                                    Nenhuma (Deixar em branco)
                                                </SelectItem>

                                                {[
                                                    "4GB",
                                                    "8GB",
                                                    "12GB",
                                                    "16GB",
                                                    "32GB",
                                                    "64GB",
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

                            <FormField
                                control={form.control}
                                name="computer.diskId"
                                render={({ field, fieldState }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                            Armazenamento (Disco)
                                        </FormLabel>
                                        <div
                                            onClick={() => {
                                                form.clearErrors(
                                                    "computer.diskId",
                                                );
                                                handleFormInteraction();
                                            }}
                                        >
                                            <ComboboxSearch
                                                options={options.disks}
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                                placeholder="Filtrar e selecionar disco..."
                                            />
                                        </div>
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

                        <FormField
                            control={form.control}
                            name="computer.mac"
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
                                            className="h-9 text-xs font-mono uppercase tracking-wider"
                                            onFocus={() =>
                                                form.clearErrors("computer.mac")
                                            }
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

                        <FormField
                            control={form.control}
                            name="computer.osId"
                            render={({ field, fieldState }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                        Sistema Operacional
                                    </FormLabel>
                                    <div
                                        onClick={() => {
                                            form.clearErrors("computer.osId");
                                            handleFormInteraction();
                                        }}
                                    >
                                        <ComboboxSearch
                                            options={options.operatingSystems}
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            placeholder="Filtrar e selecionar SO..."
                                        />
                                    </div>
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

                        {/* 🌟 VALIDAÇÃO UNIFICADA NO FINAL DO FORMULÁRIO */}
                        {apiError && (
                            <div className="pt-2">
                                <FieldError errors={[apiError]} />
                            </div>
                        )}

                        <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-5 gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                disabled={isPending}
                                className="h-9 text-xs font-bold"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="h-9 text-xs font-bold bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950"
                            >
                                {isPending ? (
                                    <Loader2
                                        className="animate-spin"
                                        size={14}
                                    />
                                ) : (
                                    "Salvar Especificações"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
