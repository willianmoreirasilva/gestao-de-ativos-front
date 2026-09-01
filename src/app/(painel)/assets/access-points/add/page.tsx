"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Resolver } from "react-hook-form";
import { FieldErrors, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { createAccessPointAction } from "@/actions/access-points";
import { AccessPointSpecsFormBlock } from "@/components/assets/access-points/access-point-specs-form-block";
import { AllocationFormBlock } from "@/components/assets/shared/allocation-form-block";
import { ConnectivityFormBlock } from "@/components/assets/shared/connectivity-form-block";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getApVlanType } from "@/lib/utils";
import {
    accessPointFormSchema,
    AccessPointFormValues,
} from "@/schemas/asset-create.schema";
import { getAssetOptionsAction } from "@/services/assets";
import { OptionItem } from "@/types/assets";

export default function AddAccessPointPage() {
    const router = useRouter();
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [options, setOptions] = useState<{
        departments: OptionItem[];
        units: OptionItem[];
        users: OptionItem[];
        switches: OptionItem[];
    }>({
        departments: [],
        units: [],
        users: [],
        switches: [],
    });

    const [selectedNetworkId, setSelectedNetworkId] = useState<string>("");
    const [selectedIpId, setSelectedIpId] = useState<string>("");
    const [isManualMode, setIsManualMode] = useState<boolean>(false);
    const [manualIpValue, setManualIpValue] = useState<string>("");
    const [ipFieldErrors, setIpFieldErrors] = useState<{
        [key: string]: string[];
    }>({});

    const form = useForm<AccessPointFormValues>({
        resolver: zodResolver(
            accessPointFormSchema,
        ) as Resolver<AccessPointFormValues>,
        defaultValues: {
            name: "",
            model: "",
            vendor: "",
            mac: "",
            ssid: "",
            wifiPassword: "",
            securityType: undefined,
            frequencyBand: undefined,
            adminUsername: "",
            adminPassword: "",
            firmwareVersion: "",
            patrimony: "",
            notes: "",
            departmentId: "",
            locationId: "",
            unitId: "",
            userId: "",
            isManualMode: false,
            manualIpValue: "",
            selectedNetworkId: "",
            selectedIpId: "",
        },
    });

    // 1. Observa o valor digitado/selecionado no campo "vendor"
    const currentVendor = useWatch({
        control: form.control,
        name: "vendor",
    });

    // 2. Resolve dinamicamente o vlanType baseado na marca (Ruckus -> WIFI_MGMT, Outras -> GENERAL_DATA)
    const currentVlanType = getApVlanType(currentVendor);

    // 3. Reseta a seleção de rede/IP se o usuário alterar o fabricante para um com escopo diferente
    useEffect(() => {
        if (selectedNetworkId) {
            setSelectedNetworkId("");
            setSelectedIpId("");
            form.setValue("selectedNetworkId", "");
            form.setValue("selectedIpId", "");
        }
    }, [currentVlanType]);

    useEffect(() => {
        async function fetchFormOptions() {
            try {
                const res = await getAssetOptionsAction();
                if (res.success && res.data) {
                    setOptions({
                        departments: res.data.departments ?? [],
                        units: res.data.units ?? [],
                        users: res.data.users ?? [],
                        switches: res.data.switches ?? [],
                    });
                }
            } catch (err) {
                console.error("Erro ao carregar opções do formulário:", err);
                toast.error("Erro ao carregar opções para o cadastro.");
            } finally {
                setIsLoadingOptions(false);
            }
        }
        fetchFormOptions();
    }, []);

    const handleManualModeChange = (manual: boolean) => {
        setIsManualMode(manual);
        form.setValue("isManualMode", manual, { shouldValidate: true });

        setSelectedNetworkId("");
        setSelectedIpId("");
        setManualIpValue("");
        form.setValue("selectedNetworkId", "");
        form.setValue("selectedIpId", "");
        form.setValue("manualIpValue", "");
    };

    const handleNetworkChange = (networkId: string) => {
        setSelectedNetworkId(networkId);
        form.setValue("selectedNetworkId", networkId, { shouldValidate: true });
        setSelectedIpId("");
        form.setValue("selectedIpId", "");
    };

    const handleIpChange = (ipId: string) => {
        setSelectedIpId(ipId);
        form.setValue("selectedIpId", ipId, { shouldValidate: true });
    };

    const handleManualIpChange = (value: string) => {
        setManualIpValue(value);
        form.setValue("manualIpValue", value, { shouldValidate: true });
    };

    const onError = (errors: FieldErrors<AccessPointFormValues>) => {
        console.warn("❌ [ERROS DE VALIDAÇÃO CLIENT-SIDE]:", errors);
    };

    async function onSubmit(data: AccessPointFormValues) {
        setIsSubmitting(true);
        setIpFieldErrors({});

        let targetIpId: string | null = null;
        if (!data.isManualMode && data.selectedNetworkId !== "REMOVE_IP") {
            targetIpId = data.selectedIpId || null;
        }

        const payload = {
            name: data.name,
            model: data.model,
            vendor: data.vendor || null,
            mac: data.mac || null,
            ssid: data.ssid || null,
            wifiPassword: data.wifiPassword || null,
            securityType: data.securityType || null,
            frequencyBand: data.frequencyBand || null,
            adminUsername: data.adminUsername || null,
            adminPassword: data.adminPassword || null,
            firmwareVersion: data.firmwareVersion || null,
            patrimony: data.patrimony || null,
            departmentId: data.departmentId || null,
            locationId: data.unitId || data.locationId || null,
            ipId: targetIpId,
            notes: data.notes || null,
            // Opcional: envia a vlanType resolvida para persistência/auditoria no backend
            vlanType: getApVlanType(data.vendor),
        };

        try {
            const result = await createAccessPointAction(payload as any);

            if (result.success) {
                toast.success("Access Point cadastrado com sucesso!");
                router.push("/assets/access-points");
                return;
            }

            if (result.error) {
                toast.error(result.error);
            }
        } catch (error) {
            console.error("[CREATE_ACCESS_POINT_ERROR]:", error);
            toast.error("Ocorreu um erro inesperado ao salvar o Access Point.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 sm:px-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        asChild
                        className="h-9 w-9 rounded-lg border-zinc-200 dark:border-zinc-800"
                    >
                        <Link href="/assets/access-points">
                            <ArrowLeft size={16} />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                            Novo Access Point
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Cadastre um novo Access Point de rede sem fio no
                            inventário
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        asChild
                        disabled={isSubmitting}
                        className="h-9 text-xs font-semibold"
                    >
                        <Link href="/assets/access-points">Cancelar</Link>
                    </Button>
                    <Button
                        onClick={form.handleSubmit(onSubmit, onError)}
                        disabled={isSubmitting || isLoadingOptions}
                        className="h-9 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 gap-1.5 shadow"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Cadastrando...
                            </>
                        ) : (
                            <>
                                <Save size={14} />
                                Salvar Access Point
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit, onError)}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <div className="lg:col-span-7 h-full">
                            <AccessPointSpecsFormBlock
                                control={form.control}
                                disabled={isSubmitting || isLoadingOptions}
                            />
                        </div>

                        <div className="lg:col-span-5 h-full">
                            {/* Passa o vlanType dinâmico resolvido por getApVlanType(currentVendor) */}
                            <ConnectivityFormBlock
                                control={form.control}
                                switches={options.switches}
                                vlanType={currentVlanType}
                                selectedNetworkId={selectedNetworkId}
                                onNetworkChange={handleNetworkChange}
                                selectedIpId={selectedIpId}
                                onIpChange={handleIpChange}
                                isManualMode={isManualMode}
                                setIsManualMode={handleManualModeChange}
                                manualIpValue={manualIpValue}
                                onManualIpChange={handleManualIpChange}
                                fieldErrors={ipFieldErrors}
                                disabled={isSubmitting || isLoadingOptions}
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <AllocationFormBlock
                            control={form.control}
                            options={{
                                departments: options.departments,
                                units: options.units,
                            }}
                            disabled={isSubmitting || isLoadingOptions}
                        />
                    </div>
                </form>
            </Form>
        </div>
    );
}
