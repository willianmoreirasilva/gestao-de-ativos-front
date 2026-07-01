"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { updateAssetAction } from "@/actions/assets";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UpdateAssetInput, UpdateAssetSchema } from "@/schemas/assets";
import { Department } from "@/types/department";
import { Location } from "@/types/location";

import { AssetBaseFields } from "../shared/asset-base-fields";
import { ComputerSpecFields } from "./computer-spec-fields";

interface ComputerEditFormProps {
    assetId: string;
    initialData: any;
    departments: { total: number; data: Department[] } | any[];
    locations: { total: number; data: Location[] } | any[];
}

export function ComputerEditForm({
    assetId,
    initialData,
    departments,
    locations,
}: ComputerEditFormProps) {
    const router = useRouter();

    const [isPending, setIsPending] = useState(false);
    const [globalError, setGlobalError] = useState("");

    const form = useForm<UpdateAssetInput>({
        resolver: zodResolver(UpdateAssetSchema),
        defaultValues: {
            patrimony: initialData.patrimony || "",
            departmentId: initialData.departmentId || "",
            locationId: initialData.locationId || "",
            computer: {
                hostname: initialData.computer?.hostname || "",
                username: initialData.computer?.username || "",
                processor: initialData.computer?.processor || null,
                memory: initialData.computer?.memory || null,
            },
        },
    });

    // 🌟 Intercepta os dados do formulário e o evento nativo do DOM
    const onSubmit = async (
        data: UpdateAssetInput,
        event?: React.BaseSyntheticEvent,
    ) => {
        if (event) {
            event.preventDefault();

            // Descobre exatamente qual elemento/botão disparou o submit original
            const submitter = (event.nativeEvent as SubmitEvent)
                .submitter as HTMLElement;

            // 🛡️ Se o evento veio de um botão de fechar modal ou salvar interno, bloqueia o salvamento do ativo!
            if (
                submitter &&
                !submitter.innerText?.includes("Salvar Alterações")
            ) {
                console.log(
                    "🛡️ Submit bloqueado: Disparado por um componente interno ao formulário.",
                );
                return;
            }
        }

        setIsPending(true);
        setGlobalError("");

        const result = await updateAssetAction(assetId, data);

        if (result.fieldErrors) {
            Object.entries(result.fieldErrors).forEach(([key, messages]) => {
                form.setError(key as any, { message: messages[0] });
            });
            setIsPending(false);
        } else if (result.error) {
            setGlobalError(result.error);
            setIsPending(false);
        } else {
            alert("Computador updated com sucesso!");
            router.refresh();
            setIsPending(false);
        }
    };

    return (
        <Form {...form}>
            {/* 🌟 Passa o evento de submit de forma encadeada para que o hook-form capture o event original */}
            <form
                onSubmit={(e) =>
                    form.handleSubmit((data) => onSubmit(data, e))(e)
                }
                className="space-y-6 max-w-4xl mx-auto"
            >
                {/* Bloco 1: Comum/Reutilizável */}
                <AssetBaseFields
                    form={form}
                    departments={departments}
                    locations={locations}
                />

                {/* Bloco 2: Técnico/Exclusivo do Computador */}
                <ComputerSpecFields form={form} />

                {/* Notificação de erro da API */}
                {globalError && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 text-xs font-semibold text-destructive border border-red-200 dark:border-red-900/30 rounded-lg">
                        {globalError}
                    </div>
                )}

                {/* Barra de Ações */}
                <div className="flex justify-end gap-3 border-t pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => router.push("/assets/computers")}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold shadow"
                    >
                        {isPending ? "Gravando..." : "Salvar Alterações"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
