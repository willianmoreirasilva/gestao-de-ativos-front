"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { FieldError } from "@/components/users/field-error";
import { OptionItem } from "@/types/assets";

const switchConnectionSchema = z.object({
    connectedToSwitchId: z
        .string()
        .uuid()
        .or(z.literal(""))
        .nullable()
        .optional(),
    switchPort: z.string().trim().nullable().optional(),
});

type SwitchConnectionFormValues = z.infer<typeof switchConnectionSchema>;

interface SwitchConnectionEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    assetId: string;
    currentSwitchId?: string | null;
    currentPort?: string | null;
    switches: OptionItem[];
}

export function SwitchConnectionEditModal({
    isOpen,
    onClose,
    assetId,
    currentSwitchId,
    currentPort,
    switches,
}: SwitchConnectionEditModalProps) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const form = useForm<SwitchConnectionFormValues>({
        resolver: zodResolver(switchConnectionSchema),
        defaultValues: {
            connectedToSwitchId: currentSwitchId || "",
            switchPort: currentPort || "",
        },
    });

    // Observa o valor selecionado do Switch para desabilitar e resetar a porta em tempo real
    const watchedSwitchId = form.watch("connectedToSwitchId");
    const isSwitchDisconnected = !watchedSwitchId || watchedSwitchId === "";

    // Sincroniza os estados ao abrir ou receber novas propriedades
    useEffect(() => {
        if (isOpen) {
            setApiError(null);
            form.reset({
                connectedToSwitchId: currentSwitchId || "",
                switchPort: currentPort || "",
            });
        }
    }, [isOpen, currentSwitchId, currentPort, form]);

    // Limpa automaticamente a porta se o usuário optar por desvincular o switch concentrador
    useEffect(() => {
        if (isSwitchDisconnected) {
            form.setValue("switchPort", "");
        }
    }, [isSwitchDisconnected, form]);

    const handleFormInteraction = () => {
        if (apiError) setApiError(null);
    };

    async function onSubmit(data: SwitchConnectionFormValues) {
        setIsPending(true);
        setApiError(null);

        // Converte strings vazias vindas do Combobox para nulo antes de enviar ao back-end
        const payload = {
            connectedToSwitchId: data.connectedToSwitchId || null,
            switchPort: data.switchPort || null,
        };

        try {
            const response = await updateAssetAction(assetId, payload);

            if (response.success) {
                toast.success("Mapeamento físico de rede atualizado!");
                router.refresh();
                onClose();
            } else {
                // Se o backend retornar um conflito de porta ocupada (Código 409 ou erro específico)
                if (
                    response.error?.toLowerCase().includes("ocupada") ||
                    response.error?.toLowerCase().includes("porta")
                ) {
                    form.setError("switchPort", {
                        type: "server",
                        message: response.error,
                    });
                } else if (response.fieldErrors) {
                    Object.entries(response.fieldErrors).forEach(
                        ([key, messages]) => {
                            form.setError(key as any, {
                                type: "server",
                                message: messages[0],
                            });
                        },
                    );
                }

                setApiError(
                    response.error || "Erro ao salvar o mapeamento de rede.",
                );
            }
        } catch (error) {
            console.error("[SWITCH_CONNECT_SUBMIT_ERROR]:", error);
            setApiError(
                "Ocorreu um erro inesperado ao processar a requisição.",
            );
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-115 bg-white dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-visible transition-colors">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
                        <Link2 className="text-blue-500" size={18} /> Mapeamento
                        de Switch & Porta
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Informe a conexão física direta deste ativo na
                        infraestrutura de rede local.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        onChange={handleFormInteraction}
                        className="space-y-4 pt-2"
                    >
                        {/* Seleção do Switch Concentrador */}
                        <FormField
                            control={form.control}
                            name="connectedToSwitchId"
                            render={({ field, fieldState }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                        Switch Concentrador
                                    </FormLabel>
                                    <div
                                        onClick={() => {
                                            form.clearErrors(
                                                "connectedToSwitchId",
                                            );
                                            handleFormInteraction();
                                        }}
                                    >
                                        <ComboboxSearch
                                            options={switches}
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            placeholder="Pesquisar e selecionar switch..."
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

                        {/* Entrada da Porta Física */}
                        <FormField
                            control={form.control}
                            name="switchPort"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                        Porta Física do Switch
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value || ""}
                                            placeholder={
                                                isSwitchDisconnected
                                                    ? "Desconectado do switch concentrador"
                                                    : "Ex: Gi1/0/24 ou Port 5"
                                            }
                                            disabled={
                                                isSwitchDisconnected ||
                                                isPending
                                            }
                                            className="h-9 text-xs font-mono disabled:bg-zinc-50 dark:disabled:bg-zinc-900/50 disabled:text-zinc-400 dark:disabled:text-zinc-500 transition-colors"
                                            onFocus={() =>
                                                form.clearErrors("switchPort")
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

                        {/* Erro global ou de API mapeado de forma padronizada */}
                        {apiError && (
                            <div className="pt-1">
                                <FieldError errors={[apiError]} />
                            </div>
                        )}

                        <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-5 gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                disabled={isPending}
                                className="h-9 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="h-9 text-xs font-bold bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-900 dark:hover:bg-zinc-200 transition-colors"
                            >
                                {isPending ? (
                                    <Loader2
                                        className="animate-spin"
                                        size={14}
                                    />
                                ) : (
                                    "Salvar Conexão"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
