"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Cpu, Loader2 } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const systemSpecsSchema = z.object({
    computer: z.object({
        hostname: z.string().min(1, "Hostname obrigatório"),
        username: z.string().min(1, "Usuário obrigatório"),
        processorId: z.string().uuid().nullable().optional(),
        osId: z.string().uuid().nullable().optional(),
        diskId: z.string().uuid().nullable().optional(),
        memory: z.string().nullable().optional(),
    }),
});

type SystemSpecsValues = z.infer<typeof systemSpecsSchema>;

type OptionItem = { id: string; name: string };

interface Props {
    isOpen: boolean;
    onClose: () => void;
    assetId: string;
    computer?: any;
    options: { processors: OptionItem[]; operatingSystems: OptionItem[]; disks: OptionItem[] };
}

export function SystemSpecsEditModal({ isOpen, onClose, assetId, computer, options }: Props) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

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
            },
        },
    });

    useEffect(() => {
        if (isOpen) {
            form.reset({
                computer: {
                    hostname: computer?.hostname || "",
                    username: computer?.username || "",
                    processorId: computer?.processor?.id || "",
                    osId: computer?.operatingSystem?.id || "",
                    diskId: computer?.disk?.id || "",
                    memory: computer?.memory || "",
                },
            });
        }
    }, [isOpen, computer?.hostname, computer?.username, computer?.processor?.id, computer?.operatingSystem?.id, computer?.disk?.id, computer?.memory, form]);

    const onSubmit = async (data: SystemSpecsValues) => {
        setIsPending(true);
        const result = await updateAssetAction(assetId, data);
        if (!result?.error) {
            router.refresh();
            onClose();
        }
        setIsPending(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-zinc-950 p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base font-bold">
                        <Cpu className="text-emerald-500" size={18} /> Editar Hardware e Sistema
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Modifique as configurações de sistema da máquina.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="computer.hostname" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold">Hostname</FormLabel>
                                    <FormControl><Input {...field} className="h-9 text-xs" /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="computer.username" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold">Usuário</FormLabel>
                                    <FormControl><Input {...field} className="h-9 text-xs" /></FormControl>
                                </FormItem>
                            )} />
                        </div>

                        {/* Processador com Busca Rápida Local */}
                        <FormField control={form.control} name="computer.processorId" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-xs font-bold">Processador (CPU)</FormLabel>
                                <ComboboxSearch
                                    options={options.processors}
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    placeholder="Filtrar e selecionar processador..."
                                />
                            </FormItem>
                        )} />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="computer.memory" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold">Memória RAM</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                        <FormControl><SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Capacidade" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {["4GB", "8GB", "12GB", "16GB", "32GB", "64GB"].map(m => (
                                                <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />

                            {/* Armazenamento com Busca Rápida Local */}
                            <FormField control={form.control} name="computer.diskId" render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-xs font-bold">Armazenamento (Disco)</FormLabel>
                                    <ComboboxSearch
                                        options={options.disks}
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        placeholder="Filtrar e selecionar disco..."
                                    />
                                </FormItem>
                            )} />
                        </div>

                        {/* Sistema Operacional com Busca Rápida Local */}
                        <FormField control={form.control} name="computer.osId" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-xs font-bold">Sistema Operacional</FormLabel>
                                <ComboboxSearch
                                    options={options.operatingSystems}
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    placeholder="Filtrar e selecionar SO..."
                                />
                            </FormItem>
                        )} />

                        <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-5">
                            <Button type="button" variant="ghost" onClick={onClose} className="h-9 text-xs font-bold">Cancelar</Button>
                            <Button type="submit" disabled={isPending} className="h-9 text-xs font-bold bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950">
                                {isPending ? <Loader2 className="animate-spin" size={14} /> : "Salvar Especificações"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}