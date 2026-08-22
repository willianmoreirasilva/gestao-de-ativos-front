"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Layout, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { updateAssetAllocationAction } from "@/actions/asset-shared.actions";
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
        resolver: zodResolver(allocationSchema) as Resolver<AllocationFormValues>,
        defaultValues: {
            patrimony: patrimony || "",
            username: username || "",
            departmentId: currentDepartmentId || "",
            locationId: currentLocationId || "",
        },
    });

    // ⚡ useEffect corrigido: executa o reset sempre que o modal abre (isOpen)
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
    }, [isOpen]); // Dependência enxuta e estável para evitar erros de renderização

    const normalizeNullableString = (val?: string | null) => {
        if (!val) return null;
        const trimmed = val.trim();
        return trimmed === "" ? null : trimmed;
    };

    async function onSubmit(data: AllocationFormValues) {
        setIsPending(true);
        setApiError(null);

        const payload = {
            patrimony: normalizeNullableString(data.patrimony),
            username: normalizeNullableString(data.username),
            departmentId: normalizeNullableString(data.departmentId),
            locationId: normalizeNullableString(data.locationId),
        };

        try {
            const res = await updateAssetAllocationAction(assetId, payload);

            if (res.success) {
                toast.success("Informações de alocação salvas!");
                router.refresh();
                onClose();
            } else {
                setApiError(res.error || "Erro ao salvar alocação.");
            }
        } catch (error) {
            setApiError("Não foi possível processar a alteração.");
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
                        Defina a localização física, patrimônio e o responsável
                        direto por este ativo.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-3 pt-2"
                    >
                        {/* Código do Patrimônio e Usuário Responsável Lado a Lado */}
                        <div className="grid grid-cols-2 gap-3">
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
                                                placeholder="Ex: PAT-2024-8832"
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
                                                placeholder="Ex: João Silva"
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
                        </div>

                        {/* Departamento / Setor */}
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
                                        placeholder="Selecionar departamento..."
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

                        {/* Localidade Principal */}
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
                                        placeholder="Selecionar localidade..."
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

                        {apiError && <FieldError errors={[apiError]} />}

                        <DialogFooter className="pt-3 border-t border-zinc-100 dark:border-zinc-900 mt-4 gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                disabled={isPending}
                                className="h-9 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="h-9 text-xs font-bold bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-900"
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
