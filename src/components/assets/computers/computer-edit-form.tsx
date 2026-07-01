"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { updateAssetAction } from "@/actions/assets";
import { AssetNetworkFields } from "@/components/assets/computers/components/asset-network-fields";
import { AssetOrganizationalFields } from "@/components/assets/computers/components/asset-organizational-fields";
import { ComputerHardwareFields } from "@/components/assets/computers/components/computer-hardware-fields";
import { Form } from "@/components/ui/form";
import { UpdateAssetInput, UpdateAssetSchema } from "@/schemas/assets";
import { Department } from "@/types/department";
import { Location } from "@/types/location";

import { AssetEditHeader } from "./components/asset-edit-header";

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

    // 🌟 UI/UX: Mapeamento completo e higienizado dos dados da API para o formulário
    const form = useForm<UpdateAssetInput>({
        resolver: zodResolver(UpdateAssetSchema),
        defaultValues: {
            patrimony: initialData.patrimony || "",
            departmentId: initialData.departmentId || "",
            locationId: initialData.locationId || "",
            newIpId: initialData.ip?.id || "", // Vincula o IP atual vindo da API
            computer: {
                hostname: initialData.computer?.hostname || "",
                username: initialData.computer?.username || "",
                processor: initialData.computer?.processor || "",
                memory: initialData.computer?.memory || "",
                disk: initialData.computer?.disk || "",
                os: initialData.computer?.os || "",
                mac: initialData.computer?.mac || "",
            },
        },
    });

    const onSubmit = async (
        data: UpdateAssetInput,
        event?: React.BaseSyntheticEvent,
    ) => {
        if (event) {
            event.preventDefault();
            const submitter = (event.nativeEvent as SubmitEvent)
                .submitter as HTMLElement;
            if (submitter && !submitter.id?.includes("btn-submit-main")) {
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
            router.push(`/assets/computers/${assetId}`);
            router.refresh();
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={(e) =>
                    form.handleSubmit((data) => onSubmit(data, e))(e)
                }
                className="space-y-6 max-w-6xl mx-auto px-4 pb-12"
            >
                {/* 1. Header Pro com botões de ação integrados */}
                <AssetEditHeader
                    assetId={assetId}
                    patrimony={initialData.patrimony}
                    isPending={isPending}
                />

                {globalError && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 text-xs font-semibold text-destructive border border-red-200 dark:border-red-900/30 rounded-lg">
                        {globalError}
                    </div>
                )}

                {/* 🌟 2. Grid Assimétrica de Alta Performance (Proporção SaaS 2:1) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Coluna da Esquerda: Dados Principais e Hardware (Ocupa 2/3 da tela) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Agora adicionado e renderizando perfeitamente! */}
                        <ComputerHardwareFields form={form} />
                    </div>

                    {/* Coluna da Direita: Metadados e Conectividade (Ocupa 1/3 da tela) */}
                    <div className="space-y-6">
                        <AssetOrganizationalFields
                            form={form}
                            departments={departments}
                            locations={locations}
                        />

                        <AssetNetworkFields
                            form={form}
                            assetId={assetId}
                            initialData={initialData}
                        />
                    </div>
                </div>
            </form>
        </Form>
    );
}
