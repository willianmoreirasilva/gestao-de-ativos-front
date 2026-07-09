"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Layout, Loader2 } from "lucide-react";
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
import { FieldError } from "@/components/users/field-error";
import { OptionItem } from "@/types/assets";

const allocationSchema = z.object({
    patrimony: z.string().nullable().optional(),
    departmentId: z.string().uuid().or(z.literal("")).nullable().optional(),
    locationId: z.string().uuid().or(z.literal("")).nullable().optional(),
    computer: z.object({
        username: z.string().min(1, "Usuário responsável obrigatório"),
    }),
});
type AllocationValues = z.infer<typeof allocationSchema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    assetId: string;
    patrimony?: string | null;
    username?: string | null;
    currentDepartmentId: string | null;
    currentLocationId: string | null;
    departments: OptionItem[];
    locations: OptionItem[];
}

export function AllocationEditModal({
    isOpen,
    onClose,
    assetId,
    patrimony,
    username,
    currentDepartmentId,
    currentLocationId,
    departments,
    locations,
}: Props) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const form = useForm<AllocationValues>({
        resolver: zodResolver(allocationSchema),
        defaultValues: {
            patrimony: patrimony || "",
            departmentId: currentDepartmentId || "", // 🌟 Igual ao SystemSpecsEditModal
            locationId: currentLocationId || "", // 🌟 Igual ao SystemSpecsEditModal
            computer: {
                username: username || "",
            },
        },
    });

    // 🌟 Idêntico ao comportamento de sincronização do SystemSpecsEditModal
    useEffect(() => {
        if (isOpen) {
            setApiError(null);
            form.reset({
                patrimony: patrimony || "",
                departmentId: currentDepartmentId || "",
                locationId: currentLocationId || "",
                computer: {
                    username: username || "",
                },
            });
        }
    }, [
        isOpen,
        patrimony,
        username,
        currentDepartmentId,
        currentLocationId,
        form,
    ]);

    const handleFormInteraction = () => {
        if (apiError) setApiError(null);
    };

    const onSubmit = async (data: AllocationValues) => {
        setIsPending(true);
        setApiError(null);

        try {
            // 🌟 As travas antigas foram removidas. Agora enviamos o objeto diretamente.
            // Se 'departmentId' ou 'locationId' forem "", a Server Action cuidará de converter para null.
            const result = await updateAssetAction(assetId, data);

            if (result.success) {
                router.refresh();
                onClose();
            } else {
                // Mapeia os erros estruturados retornados do servidor/Zod, se houverem
                if (result.fieldErrors) {
                    Object.entries(result.fieldErrors).forEach(
                        ([key, messages]) => {
                            form.setError(key as any, {
                                type: "server",
                                message: messages[0],
                            });
                        },
                    );
                }

                setApiError(
                    result.error ||
                        "Erro ao atualizar alocações de infraestrutura.",
                );
            }
        } catch (error) {
            console.error("[ALLOCATION_SUBMIT_ERROR]:", error);
            setApiError(
                "Ocorreu um erro inesperado ao processar a requisição.",
            );
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-115 bg-white dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-visible">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
                        <Layout className="text-purple-500" size={18} /> Editar
                        Responsabilidade e Alocação
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Atualize o patrimônio, setor e localidade onde este
                        ativo opera.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        onChange={handleFormInteraction}
                        className="space-y-4 pt-2"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="patrimony"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                            Patrimônio Corp.
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value || ""}
                                                placeholder="Ex: PAT-01824"
                                                className="h-9 text-xs font-mono uppercase"
                                                onFocus={() =>
                                                    form.clearErrors(
                                                        "patrimony",
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
                                            Usuário de Domínio
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
                            name="departmentId"
                            render={({ field, fieldState }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                        Departamento / Setor
                                    </FormLabel>
                                    <div
                                        onClick={() => {
                                            form.clearErrors("departmentId");
                                            handleFormInteraction();
                                        }}
                                    >
                                        <ComboboxSearch
                                            options={departments}
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            placeholder="Pesquisar e selecionar departamento..."
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

                        <FormField
                            control={form.control}
                            name="locationId"
                            render={({ field, fieldState }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                        Localidade Principal
                                    </FormLabel>
                                    <div
                                        onClick={() => {
                                            form.clearErrors("locationId");
                                            handleFormInteraction();
                                        }}
                                    >
                                        <ComboboxSearch
                                            options={locations}
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            placeholder="Pesquisar e selecionar localidade..."
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
                                    "Salvar Alterações"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
