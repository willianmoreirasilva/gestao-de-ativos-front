"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Loader2, Phone, PhoneCall, Save, X } from "lucide-react";
import { useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { updatePhoneSpecsAction } from "@/actions/assets/phones.actions";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const phoneSpecsSchema = z.object({
    hostname: z.string().optional().nullable(),
    phoneNumber: z.string().min(1, "O número/ramal é obrigatório."),
    model: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
});

type PhoneSpecsFormValues = z.infer<typeof phoneSpecsSchema>;

interface PhoneHardwareCardProps {
    assetId: string;
    phone: {
        id?: string;
        hostname?: string | null;
        phoneNumber: string;
        model?: string | null;
        notes?: string | null;
    };
}

export function PhoneHardwareCard({ assetId, phone }: PhoneHardwareCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<PhoneSpecsFormValues>({
        resolver: zodResolver(
            phoneSpecsSchema,
        ) as Resolver<PhoneSpecsFormValues>,
        defaultValues: {
            hostname: phone?.hostname || "",
            phoneNumber: phone?.phoneNumber || "",
            model: phone?.model || "",
            notes: phone?.notes || "",
        },
    });

    const handleCancel = () => {
        form.reset({
            hostname: phone?.hostname || "",
            phoneNumber: phone?.phoneNumber || "",
            model: phone?.model || "",
            notes: phone?.notes || "",
        });
        setIsEditing(false);
    };

    const onSubmit = async (values: PhoneSpecsFormValues) => {
        setIsSubmitting(true);
        try {
            const res = await updatePhoneSpecsAction(assetId, {
                hostname: values.hostname || null,
                phoneNumber: values.phoneNumber,
                model: values.model || null,
                notes: values.notes || null,
            });

            if (res.success) {
                toast.success("Especificações do telefone atualizadas!");
                setIsEditing(false);
            } else {
                toast.error(res.error || "Erro ao atualizar dados.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro inesperado ao salvar alterações.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-900">
                <div className="flex items-center gap-2">
                    <Phone
                        className="text-blue-600 dark:text-blue-400"
                        size={18}
                    />
                    <div>
                        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                            Especificações do Telefone / Ramal
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Identificação SIP, ramal e modelo do aparelho
                        </p>
                    </div>
                </div>

                {!isEditing ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="h-8 text-xs font-semibold gap-1.5"
                    >
                        <Edit2 size={13} />
                        Editar
                    </Button>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="h-8 text-xs font-semibold gap-1"
                        >
                            <X size={13} />
                            Cancelar
                        </Button>
                        <Button
                            size="sm"
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            className="h-8 text-xs font-semibold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isSubmitting ? (
                                <Loader2 size={13} className="animate-spin" />
                            ) : (
                                <Save size={13} />
                            )}
                            Salvar
                        </Button>
                    </div>
                )}
            </div>

            {isEditing ? (
                <Form {...form}>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Hostname */}
                        <FormField
                            control={form.control}
                            name="hostname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold">
                                        Hostname / Identificador
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value || ""}
                                            placeholder="Ex: TEL-FINANCEIRO-01"
                                            className="h-9 text-xs uppercase font-mono"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[11px]" />
                                </FormItem>
                            )}
                        />

                        {/* Número do Ramal */}
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-semibold">
                                        Número do Ramal{" "}
                                        <span className="text-rose-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value || ""}
                                            placeholder="Ex: 4004 ou 201"
                                            className="h-9 text-xs font-mono"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[11px]" />
                                </FormItem>
                            )}
                        />

                        {/* Modelo */}
                        <FormField
                            control={form.control}
                            name="model"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel className="text-xs font-semibold">
                                        Modelo do Aparelho
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value || ""}
                                            placeholder="Ex: Yealink SIP-T31P"
                                            className="h-9 text-xs"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[11px]" />
                                </FormItem>
                            )}
                        />

                        {/* Observações */}
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel className="text-xs font-semibold">
                                        Observações Gerais
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            value={field.value || ""}
                                            placeholder="Detalhes adicionais..."
                                            className="text-xs min-h-20 resize-none"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[11px]" />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60">
                        <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                            <PhoneCall size={13} /> Hostname / Dispositivo
                        </span>
                        <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 uppercase">
                            {phone?.hostname || "NÃO REGISTRADO"}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60">
                        <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                            Número / Ramal
                        </span>
                        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                            {phone?.phoneNumber || "SEM RAMAL"}
                        </span>
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-1 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60">
                        <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                            Modelo do Telefone
                        </span>
                        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                            {phone?.model || "Modelo Genérico / VoIP"}
                        </span>
                    </div>

                    {phone?.notes && (
                        <div className="md:col-span-2 flex flex-col gap-1 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60">
                            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                                Observações
                            </span>
                            <p className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                                {phone.notes}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
