"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2, MapPin, ShieldCheck, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { updateAssetAction } from "@/actions/assets"; // Ajuste conforme sua server action real
import { Button } from "@/components/ui/button";
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
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Trigger,
} from "@/components/ui/select";

// Schema local e tipagem estrita para o escopo de alocação
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
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Inicialização do Form com higienização estrita dos estados passados por props
    const form = useForm<AllocationFormValues>({
        resolver: zodResolver(allocationFormSchema),
        defaultValues: {
            patrimony: patrimony || "",
            departmentId: currentDepartmentId || "unlinked",
            locationId: currentLocationId || "unlinked",
            computer: {
                username: username || "",
            },
        },
    });

    const handleSave = async (data: AllocationFormValues) => {
        setIsPending(true);
        setErrorMessage(null);

        // Tratamento elegante para valores vazios/desvinculados antes de enviar para a API
        const payload = {
            patrimony: data.patrimony === "" ? null : data.patrimony,
            departmentId:
                data.departmentId === "unlinked" ? null : data.departmentId,
            locationId: data.locationId === "unlinked" ? null : data.locationId,
            computer: {
                username: data.computer.username,
            },
        };

        const result = await updateAssetAction(assetId, payload);

        if (result?.error) {
            setErrorMessage(result.error);
            setIsPending(false);
        } else {
            setIsPending(false);
            router.refresh(); // 🔥 Dá o refresh atômico na ficha técnica por trás
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[480px] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg p-6">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <Building2 size={18} className="text-purple-500" />{" "}
                        Modificar Alocação e Responsável
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Atualize a localização física e o usuário encarregado
                        deste terminal.
                    </DialogDescription>
                </DialogHeader>

                {errorMessage && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 text-xs font-semibold text-destructive border border-red-200 dark:border-red-900/30 rounded-lg">
                        {errorMessage}
                    </div>
                )}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSave)}
                        className="space-y-4 pt-2"
                    >
                        {/* Campo 1: Código de Patrimônio */}
                        <FormField
                            control={form.control}
                            name="patrimony"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                        <ShieldCheck
                                            size={14}
                                            className="text-zinc-400"
                                        />{" "}
                                        Etiqueta de Patrimônio
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: PAT-00124"
                                            className="h-9 font-mono uppercase tracking-wider text-xs"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[11px]" />
                                </FormItem>
                            )}
                        />

                        {/* Campo 2: Utilizador Principal */}
                        <FormField
                            control={form.control}
                            name="computer.username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                        <User
                                            size={14}
                                            className="text-zinc-400"
                                        />{" "}
                                        Usuário Utilizador
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: joao.silva"
                                            className="h-9 text-xs"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[11px]" />
                                </FormItem>
                            )}
                        />

                        {/* Campo 3: Departamento */}
                        <FormField
                            control={form.control}
                            name="departmentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                        <Building2
                                            size={14}
                                            className="text-zinc-400"
                                        />{" "}
                                        Setor / Departamento
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value || "unlinked"}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="h-9 text-xs">
                                                <SelectValue placeholder="Selecione o setor" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem
                                                value="unlinked"
                                                className="text-xs text-muted-foreground"
                                            >
                                                Não Vinculado
                                            </SelectItem>
                                            {departments.map((dept) => (
                                                <SelectItem
                                                    key={dept.id}
                                                    value={dept.id}
                                                    className="text-xs"
                                                >
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-[11px]" />
                                </FormItem>
                            )}
                        />

                        {/* Campo 4: Localidade Principal */}
                        <FormField
                            control={form.control}
                            name="locationId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                                        <MapPin
                                            size={14}
                                            className="text-zinc-400"
                                        />{" "}
                                        Localidade Física
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value || "unlinked"}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="h-9 text-xs">
                                                <SelectValue placeholder="Selecione a localidade" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem
                                                value="unlinked"
                                                className="text-xs text-muted-foreground"
                                            >
                                                Não Alocado
                                            </SelectItem>
                                            {locations.map((loc) => (
                                                <SelectItem
                                                    key={loc.id}
                                                    value={loc.id}
                                                    className="text-xs"
                                                >
                                                    {loc.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-[11px]" />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-5 gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                disabled={isPending}
                                className="h-9 text-xs font-semibold"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="h-9 text-xs font-semibold bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-900"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2
                                            size={14}
                                            className="animate-spin mr-1.5"
                                        />{" "}
                                        Salvando...
                                    </>
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
