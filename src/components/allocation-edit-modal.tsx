"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Layout, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { updateAssetAllocationAction } from "@/actions/asset-shared.actions";
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
import { FieldError } from "@/components/users/field-error";
import { OptionItem } from "@/types/assets";

// ✅ 1. Schema ajustado: todos os campos aceitam string vazia ou null
const allocationSchema = z.object({
    patrimony: z.string().trim().nullable().optional(),
    username: z.string().trim().nullable().optional(),
    departmentId: z.string().uuid().or(z.literal("")).nullable().optional(),
    locationId: z.string().uuid().or(z.literal("")).nullable().optional(),
});

type AllocationFormValues = z.infer<typeof allocationSchema>;

interface AllocationEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    assetId: string;
    patrimony?: string | null;
    username?: string | null;
    currentDepartmentId?: string | null;
    currentLocationId?: string | null;
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
}: AllocationEditModalProps) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const form = useForm<AllocationFormValues>({
        resolver: zodResolver(allocationSchema),
        defaultValues: {
            patrimony: patrimony || "",
            username: username || "",
            departmentId: currentDepartmentId || "",
            locationId: currentLocationId || "",
        },
    });

    useEffect(() => {
        if (isOpen) {
            setApiError(null);
            form.reset({
                patrimony: patrimony || "",
                username: username || "",
                departmentId: currentDepartmentId || "",
                locationId: currentLocationId || "",
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

    // Função auxiliar para converter strings vazias em null
    const normalizeNullableString = (val?: string | null) => {
        if (!val) return null;
        const trimmed = val.trim();
        return trimmed === "" ? null : trimmed;
    };

    async function onSubmit(data: AllocationFormValues) {
        setIsPending(true);
        setApiError(null);

        // ✅ 2. Converte explicitamente qualquer string vazia em NULL
        const allocationPayload = {
            patrimony: normalizeNullableString(data.patrimony),
            departmentId: normalizeNullableString(data.departmentId),
            locationId: normalizeNullableString(data.locationId),
        };

        const specsPayload = {
            username: normalizeNullableString(data.username) || "", // Ou null dependendo de como o backend Computer trata
        };

        try {
            const allocationPromise = updateAssetAllocationAction(
                assetId,
                allocationPayload,
            );
            const specsPromise = updateComputerSpecsAction(
                assetId,
                specsPayload,
            );

            const [allocationRes, specsRes] = await Promise.all([
                allocationPromise,
                specsPromise,
            ]);

            if (allocationRes.success && specsRes.success) {
                toast.success(
                    "Informações de alocação e responsabilidade salvas!",
                );
                router.refresh();
                onClose();
            } else {
                const failedRes = !allocationRes.success
                    ? allocationRes
                    : specsRes;

                if (failedRes.fieldErrors) {
                    Object.entries(failedRes.fieldErrors).forEach(
                        ([key, messages]) => {
                            form.setError(key as any, {
                                type: "server",
                                message: messages[0],
                            });
                        },
                    );
                }

                setApiError(
                    failedRes.error ||
                        "Erro ao salvar as configurações de alocação.",
                );
            }
        } catch (error) {
            console.error("[ALLOCATION_SUBMIT_ERROR]:", error);
            setApiError("Não foi possível processar as alterações no momento.");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-115 bg-white dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-visible">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
                        <Layout className="text-purple-500" size={18} />{" "}
                        Modificar Alocação & Setor
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Defina a nova localização física e o colaborador
                        encarregado pelo ativo.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 pt-2"
                    >
                        {/* Campo: Código de Patrimônio */}
                        <FormField
                            control={form.control}
                            name="patrimony"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                        Código do Patrimônio
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value || ""}
                                            placeholder="Ex: PAT-2024-8832 (deixe em branco para remover)"
                                            disabled={isPending}
                                            className="h-9 text-xs uppercase tracking-wider font-mono"
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

                        {/* Campo: Usuário Responsável */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                        Usuário Responsável
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value || ""}
                                            placeholder="Ex: João Silva ou Operador"
                                            disabled={isPending}
                                            className="h-9 text-xs font-medium"
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

                        {/* Campo: Departamento */}
                        <FormField
                            control={form.control}
                            name="departmentId"
                            render={({ field, fieldState }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                        Departamento / Setor Destino
                                    </FormLabel>
                                    <ComboboxSearch
                                        options={departments}
                                        value={field.value || ""}
                                        onChange={(val) =>
                                            field.onChange(val || "")
                                        }
                                        placeholder="Selecionar departamento (ou desmarcar)..."
                                    />
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

                        {/* Campo: Localidade Principal */}
                        <FormField
                            control={form.control}
                            name="locationId"
                            render={({ field, fieldState }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                        Localidade Física Principal
                                    </FormLabel>
                                    <ComboboxSearch
                                        options={locations}
                                        value={field.value || ""}
                                        onChange={(val) =>
                                            field.onChange(val || "")
                                        }
                                        placeholder="Selecionar localidade (ou desmarcar)..."
                                    />
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

                        {/* Erro global padronizado */}
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
                                    "Confirmar Alterações"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
