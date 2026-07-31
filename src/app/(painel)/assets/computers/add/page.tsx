"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { createComputerAssetAction } from "@/actions/assets";
import { ComputerSpecsFormBlock } from "@/components/assets/computers/computer-specs-form-block";
import { AllocationFormBlock } from "@/components/assets/shared/allocation-form-block";
import { ConnectivityFormBlock } from "@/components/assets/shared/connectivity-form-block";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
    computerFormSchema,
    type ComputerFormValues,
} from "@/schemas/asset-create.schema";
import { getAssetOptionsAction } from "@/services/assets";
import { OptionItem } from "@/types/assets";

export default function AddComputerPage() {
    const router = useRouter();
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [options, setOptions] = useState<{
        processors: OptionItem[];
        operatingSystems: OptionItem[];
        disks: OptionItem[];
        departments: OptionItem[];
        units: OptionItem[];
        users: OptionItem[];
        switches: OptionItem[];
    }>({
        processors: [],
        operatingSystems: [],
        disks: [],
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

    const form = useForm<ComputerFormValues>({
        resolver: zodResolver(computerFormSchema),
        defaultValues: {
            hostname: "",
            username: "",
            patrimony: "",
            osId: "",
            processorId: "",
            memory: "",
            diskId: "",
            mac: "",
            notes: "",
            switchId: "",
            switchPort: "",
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

    useEffect(() => {
        async function fetchFormOptions() {
            try {
                const res = await getAssetOptionsAction();
                if (res.success && res.data) {
                    setOptions({
                        processors: res.data.processors ?? [],
                        operatingSystems: res.data.operatingSystems ?? [],
                        disks: res.data.disks ?? [],
                        departments: res.data.departments ?? [],
                        units: res.data.units ?? [],
                        users: res.data.users ?? [],
                        switches: res.data.switches ?? [],
                    });
                }
            } catch (err) {
                console.error("Erro ao carregar opções do formulário:", err);
                toast.error("Erro ao carregar opções para o cadastro.", {
                    position: "bottom-right",
                });
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

    // Função de tratamento de erros no Client-Side (Sem exibições de Toast)
    const onError = (errors: FieldErrors<ComputerFormValues>) => {
        console.warn("❌ [ERROS DE VALIDAÇÃO CLIENT-SIDE]:", errors);
    };

    async function onSubmit(data: z.input<typeof computerFormSchema>) {
        console.log("🔥 PAYLOAD DISPARADO:", data);
        setIsSubmitting(true);
        setIpFieldErrors({});

        let targetIpId: string | null = null;
        if (!data.isManualMode && data.selectedNetworkId !== "REMOVE_IP") {
            targetIpId = data.selectedIpId || null;
        }

        const payload: ComputerFormValues = {
            ...data,
            locationId: data.unitId || data.locationId || null,
            selectedIpId: targetIpId,
            isManualMode: Boolean(data.isManualMode),
            manualIpValue: data.isManualMode
                ? data.manualIpValue || null
                : null,
        };

        try {
            const result = await createComputerAssetAction(payload as any);
            const onError = (errors: any) => {
                console.error(
                    "❌ ERROS DE VALIDAÇÃO DO FORMULÁRIO (ZOD):",
                    errors,
                );
            };

            if (result.success) {
                toast.success("Computador cadastrado com sucesso!", {
                    position: "bottom-right",
                });
                router.push("/assets/computers");
                return;
            }

            if (result.fieldErrors) {
                Object.entries(result.fieldErrors).forEach(
                    ([key, messages]) => {
                        const errMsgs = messages as string[];

                        // Mapeamento de erros de conectividade/IP
                        if (
                            [
                                "manualIpValue",
                                "manualIpAddress",
                                "selectedIpId",
                                "ipId",
                                "newIpAddress",
                                "ipAddress",
                            ].includes(key)
                        ) {
                            setIpFieldErrors((prev) => ({
                                ...prev,
                                [key]: errMsgs,
                            }));
                        } else {
                            // DE/PARA: Mapeia erro de 'locationId' para o campo de formulário 'unitId'
                            const targetField =
                                key === "locationId" ? "unitId" : key;

                            form.setError(
                                targetField as keyof ComputerFormValues,
                                {
                                    type: "server",
                                    message: errMsgs[0],
                                },
                            );
                        }
                    },
                );
            }

            if (result.error) {
                toast.error(result.error, {
                    position: "bottom-right",
                });
            }
        } catch (error) {
            console.error("[CREATE_COMPUTER_ERROR]:", error);
            toast.error("Ocorreu um erro inesperado ao salvar o ativo.", {
                position: "bottom-right",
            });
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
                        <Link href="/assets/computers">
                            <ArrowLeft size={16} />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                            Novo Computador
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Cadastre um novo ativo de computação na rede
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
                        <Link href="/assets/computers">Cancelar</Link>
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
                                Salvar Computador
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
                            <ComputerSpecsFormBlock
                                control={form.control}
                                setValue={form.setValue}
                                options={{
                                    processors: options.processors,
                                    operatingSystems: options.operatingSystems,
                                    disks: options.disks,
                                }}
                                disabled={isSubmitting || isLoadingOptions}
                            />
                        </div>

                        <div className="lg:col-span-5 h-full">
                            <ConnectivityFormBlock
                                control={form.control}
                                switches={options.switches}
                                vlanType="GENERAL_DATA"
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
                                users: options.users,
                            }}
                            disabled={isSubmitting || isLoadingOptions}
                        />
                    </div>
                </form>
            </Form>
        </div>
    );
}
