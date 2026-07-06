"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { updateAssetAction } from "@/actions/assets";
import { Button } from "@/components/ui/button";
import { ComboboxSearch } from "@/components/ui/combobox-search"; // 🌟 Importado o componente local
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const allocationFormSchema = z.object({
    patrimony: z.string().nullable().optional(),
    departmentId: z.string().uuid().nullable().optional(),
    locationId: z.string().uuid().nullable().optional(),
    computer: z.object({
        username: z.string().min(1, "O utilizador é obrigatório"),
    }),
});

type AllocationFormValues = z.infer<typeof allocationFormSchema>;

interface AllocationEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    assetId: string;
    patrimony?: string | null;
    username?: string | null;
    currentDepartmentId?: string | null;
    currentLocationId?: string | null;
    departments: Array<{ id: string; name: string }>;
    locations: Array<{ id: string; name: string }>;
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

    const form = useForm<AllocationFormValues>({
        resolver: zodResolver(allocationFormSchema),
        defaultValues: {
            patrimony: patrimony || "",
            departmentId: currentDepartmentId || "",
            locationId: currentLocationId || "",
            computer: {
                username: username || "",
            },
        },
    });

    useEffect(() => {
        if (isOpen) {
            form.reset({
                patrimony: patrimony || "",
                departmentId: currentDepartmentId || "",
                locationId: currentLocationId || "",
                computer: {
                    username: username || "",
                },
            });
        }
    }, [isOpen, patrimony, currentDepartmentId, currentLocationId, username, form]);

    const handleSave = async (data: AllocationFormValues) => {
        setIsPending(true);
        const payload = {
            patrimony: data.patrimony === "" ? null : data.patrimony,
            departmentId: data.departmentId === "" ? null : data.departmentId,
            locationId: data.locationId === "" ? null : data.locationId,
            computer: {
                username: data.computer.username,
            },
        };

        const result = await updateAssetAction(assetId, payload);
        if (!result?.error) {
            router.refresh();
            onClose();
        }
        setIsPending(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[480px] bg-white dark:bg-zinc-950 p-6">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold flex items-center gap-2">
                        <Building2 size={18} className="text-purple-500" /> Modificar Alocação e Responsável
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Atualize as dependências e o utilizador deste terminal corporativo.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4 pt-2">
                        <FormField control={form.control} name="patrimony" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold">Etiqueta de Patrimônio</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: PAT-001" className="h-9 font-mono uppercase text-xs" {...field} value={field.value || ""} />
                                </FormControl>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="computer.username" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold">Usuário Utilizador</FormLabel>
                                <FormControl><Input placeholder="Ex: joao.silva" className="h-9 text-xs" {...field} /></FormControl>
                            </FormItem>
                        )} />

                        {/* Departamento com Filtro de Digitação Rápido */}
                        <FormField control={form.control} name="departmentId" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-xs font-bold">Setor / Departamento</FormLabel>
                                <ComboboxSearch
                                    options={departments}
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    placeholder="Filtrar e selecionar setor..."
                                />
                            </FormItem>
                        )} />

                        {/* Localidade com Filtro de Digitação Rápido */}
                        <FormField control={form.control} name="locationId" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-xs font-bold">Localidade Física</FormLabel>
                                <ComboboxSearch
                                    options={locations}
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    placeholder="Filtrar e selecionar local..."
                                />
                            </FormItem>
                        )} />

                        <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-5">
                            <Button type="button" variant="ghost" onClick={onClose} className="h-9 text-xs font-bold">Cancelar</Button>
                            <Button type="submit" disabled={isPending} className="h-9 text-xs font-bold bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950">
                                {isPending ? <Loader2 className="animate-spin" size={14} /> : "Salvar Alterações"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}