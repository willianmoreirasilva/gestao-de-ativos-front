"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Cpu, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/users/field-error"; // 🌟 Seu componente de erro padrão recuperado

// Regex original recuperada para validação de MAC
const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

const hardwareSchema = z.object({
    computer: z.object({
        hostname: z.string().min(1, "Hostname obrigatório").trim(),
        username: z.string().min(1, "Usuário obrigatório").trim(),
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
        notes: z.string().trim().nullable().optional(), // 🌟 Campo de notas adicionado ao schema
    }),
});

type HardwareFormValues = z.infer<typeof hardwareSchema>;

type OptionItem = { id: string; name: string };

interface SystemSpecsEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    assetId: string;
    computer?: any;
    options: {
        processors: OptionItem[];
        operatingSystems: OptionItem[];
        disks: OptionItem[];
    };
}

export function SystemSpecsEditModal({
    isOpen,
    onClose,
    assetId,
    computer,
    options,
}: SystemSpecsEditModalProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [apiError, setApiError] = useState<string | null>(null); // 🌟 Recuperado o estado de erro geral da API

    const form = useForm<HardwareFormValues>({
        resolver: zodResolver(hardwareSchema),
        defaultValues: {
            computer: {
                hostname: computer?.hostname || "",
                username: computer?.username || "",
                processorId: computer?.processor?.id || "",
                osId: computer?.operatingSystem?.id || "",
                diskId: computer?.disk?.id || "",
                memory: computer?.memory || "",
                mac: computer?.mac || "",
                notes: computer?.notes || "", // 🌟 Valor padrão de notas mapeado corretamente
            },
        },
    });

    // Sincroniza o formulário com os dados recebidos ao abrir o modal
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
                    notes: computer?.notes || "",
                },
            });
        }
    }, [isOpen, computer, form]);

    // Limpa o erro geral ao interagir com o formulário
    const handleFormInteraction = () => {
        if (apiError) setApiError(null);
    };

    async function onSubmit(data: HardwareFormValues) {
        setApiError(null);

        startTransition(async () => {
            // 🌟 Sanitização idêntica ao código antigo para garantir que campos vazios enviem NULL à API
            const sanitizedPayload = {
                computer: {
                    hostname: data.computer.hostname,
                    username: data.computer.username,
                    processorId:
                        data.computer.processorId === ""
                            ? null
                            : data.computer.processorId,
                    operatingSystemId:
                        data.computer.osId === "" ? null : data.computer.osId,
                    diskId:
                        data.computer.diskId === ""
                            ? null
                            : data.computer.diskId,
                    memory:
                        data.computer.memory === ""
                            ? null
                            : data.computer.memory,
                    mac:
                        data.computer.mac?.trim() === ""
                            ? null
                            : data.computer.mac?.trim(),
                    notes:
                        data.computer.notes?.trim() === ""
                            ? null
                            : data.computer.notes?.trim(), // 🌟 Sanitização das notas
                },
            };

            const response = await updateAssetAction(
                assetId,
                sanitizedPayload as any,
            );

            if (response.success) {
                toast.success("Especificações técnicas salvas!");
                router.refresh();
                onClose();
            } else {
                // Mapeamento de erros de validação retornados pela API nos campos correspondentes
                if (response.fieldErrors) {
                    Object.entries(response.fieldErrors).forEach(
                        ([key, messages]) => {
                            const errorMsg = Array.isArray(messages)
                                ? messages[0]
                                : messages;
                            if (key.startsWith("computer.")) {
                                form.setError(key as any, {
                                    type: "server",
                                    message: errorMsg,
                                });
                            } else if (
                                [
                                    "mac",
                                    "hostname",
                                    "username",
                                    "memory",
                                    "notes",
                                ].includes(key)
                            ) {
                                form.setError(`computer.${key}` as any, {
                                    type: "server",
                                    message: errorMsg,
                                });
                            } else {
                                form.setError(key as any, {
                                    type: "server",
                                    message: errorMsg,
                                });
                            }
                        },
                    );
                }
                setApiError(
                    response.error ||
                        "Erro ao salvar especificações. Verifique os dados.",
                );
            }
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
                        <Cpu className="text-emerald-500" size={18} /> Editar
                        Hardware e Sistema
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Modifique as configurações de sistema da máquina, rede
                        MAC e anotações técnicas.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        onChange={handleFormInteraction}
                        className="space-y-4 pt-2"
                    >
                        {/* Hostname e Usuário */}
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

                        {/* Processador (Filtro Inteligente Combobox) */}
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

                        {/* Memória RAM e Armazenamento */}
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

                        {/* MAC Address */}
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

                        {/* Sistema Operacional (Filtro Inteligente Combobox) */}
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

                        {/* 🌟 CAMPO DE NOTAS (TEXTAREA) ADICIONADO AQUI */}
                        <FormField
                            control={form.control}
                            name="computer.notes"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                        Notas / Observações
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Adicione anotações técnicas sobre este computador..."
                                            className="text-xs min-h-[80px] resize-none"
                                            {...field}
                                            value={field.value || ""}
                                            onFocus={() =>
                                                form.clearErrors(
                                                    "computer.notes",
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

                        {/* Validação Geral de API */}
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
