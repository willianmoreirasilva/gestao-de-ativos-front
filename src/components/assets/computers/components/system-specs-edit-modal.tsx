"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Cpu, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateComputerSpecsAction } from "@/actions/asset-specs.actions";
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
import { FieldError } from "@/components/users/field-error";

const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

// Schema simplificado - deixa a responsabilidade do nulo com a Action
const hardwareSchema = z.object({
    hostname: z.string().trim().min(1, "Hostname é obrigatório"),
    username: z.string().trim().min(1, "Usuário é obrigatório"),
    processorId: z.string().optional(),
    osId: z.string().optional(),
    diskId: z.string().optional(),
    memory: z.string().optional(),
    mac: z
        .string()
        .nullable()
        .optional()
        .refine((val) => !val || val.trim() === "" || macRegex.test(val), {
            message: "Formato de MAC inválido. Ex: 00:1A:3F:F1:4C:C2",
        }),
    notes: z.string().nullable().optional(),
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
    const [apiError, setApiError] = useState<string | null>(null);

    const form = useForm<HardwareFormValues>({
        resolver: zodResolver(hardwareSchema),
        defaultValues: {
            hostname: computer?.hostname || "",
            username: computer?.username || "",
            processorId: computer?.processor?.id || computer?.processorId || "",
            osId:
                computer?.operatingSystem?.id ||
                computer?.operatingSystemId ||
                "",
            diskId: computer?.disk?.id || computer?.storageDiskId || "",
            memory: computer?.memory || computer?.ramMemory || "",
            mac: computer?.mac || "",
            notes: computer?.notes || "",
        },
    });

    useEffect(() => {
        if (isOpen) {
            setApiError(null);
            form.reset({
                hostname: computer?.hostname || "",
                username: computer?.username || "",
                processorId:
                    computer?.processor?.id || computer?.processorId || "",
                osId:
                    computer?.operatingSystem?.id ||
                    computer?.operatingSystemId ||
                    "",
                diskId: computer?.disk?.id || computer?.storageDiskId || "",
                memory: computer?.memory || computer?.ramMemory || "",
                mac: computer?.mac || "",
                notes: computer?.notes || "",
            });
        }
    }, [isOpen, computer, form]);

    async function onSubmit(data: HardwareFormValues) {
        setApiError(null);

        startTransition(async () => {
            // Mapeia os dados locais para as chaves exatas esperadas pela Action/Backend
            const payload = {
                hostname: data.hostname,
                username: data.username || "Utilizador Padrão",
                processorId: data.processorId || null,
                osId: data.osId || null,
                diskId: data.diskId || null,
                memory: data.memory || null,
                mac: data.mac || null,
                notes: data.notes || null,
            };
            const response = await updateComputerSpecsAction(assetId, payload);

            if (response.success) {
                toast.success("Especificações técnicas atualizadas!");
                router.refresh();
                onClose();
            } else {
                setApiError(response.error || "Erro ao salvar especificações.");
            }
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-125 bg-white dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
                        <Cpu className="text-emerald-500" size={18} /> Editar
                        Hardware e Sistema
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Modifique as configurações de hardware do ativo. Deixe
                        em branco para remover um item.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 pt-2"
                    >
                        {/* Hostname e Usuário */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="hostname"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                            Hostname *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="h-9 text-xs"
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
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                            Usuário *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="h-9 text-xs"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Processador */}
                        <FormField
                            control={form.control}
                            name="processorId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                        Processador (CPU)
                                    </FormLabel>
                                    <ComboboxSearch
                                        options={options.processors}
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        placeholder="Selecionar processador (ou deixe vazio)..."
                                    />
                                </FormItem>
                            )}
                        />

                        {/* Memória RAM e Armazenamento */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="memory"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                            Memória RAM
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-9 text-xs">
                                                    <SelectValue placeholder="Limpar / Selecionar" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem
                                                    value=""
                                                    className="text-xs text-muted-foreground italic"
                                                >
                                                    Remover / Desvincular
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
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="diskId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                            Armazenamento
                                        </FormLabel>
                                        <ComboboxSearch
                                            options={options.disks}
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            placeholder="Selecionar disco (ou deixe vazio)..."
                                        />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* MAC Address */}
                        <FormField
                            control={form.control}
                            name="mac"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                        Endereço MAC
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value || ""}
                                            placeholder="Ex: 00:1A:3F:F1:4C:C2"
                                            className="h-9 text-xs font-mono uppercase"
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
                            control={form.control}
                            name="osId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                        Sistema Operacional
                                    </FormLabel>
                                    <ComboboxSearch
                                        options={options.operatingSystems}
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        placeholder="Selecionar OS (ou deixe vazio)..."
                                    />
                                </FormItem>
                            )}
                        />

                        {/* Notas / Observações com botão de exclusão */}
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                            Notas / Observações
                                        </FormLabel>
                                        {field.value && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() =>
                                                    form.setValue("notes", "")
                                                }
                                                className="h-6 px-2 text-[10px] text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1"
                                            >
                                                <Trash2 size={12} /> Excluir
                                                nota
                                            </Button>
                                        )}
                                    </div>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Adicione anotações técnicas..."
                                            className="text-xs min-h-[70px] resize-none"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {apiError && <FieldError errors={[apiError]} />}

                        <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-5 gap-2">
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
