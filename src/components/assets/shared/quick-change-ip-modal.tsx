"use client";

import { AlertTriangle, Network, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

import { updateAssetConnectivityAction } from "@/actions/asset-shared.actions";
import { findIpByAddressAction } from "@/actions/assets";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/users/field-error";

import { NetworkSelectorFields } from "./network-selector-fields";

const ipValidationSchema = z
    .string()
    .trim()
    .refine(
        (value) =>
            /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(
                value,
            ),
        {
            message: "Insira um endereço IPv4 válido (Ex: 192.168.7.33).",
        },
    );

type Props = {
    assetId: string;
    currentIp: string | null;
    vlanType: "GENERAL_DATA" | "CAMERA_VLAN" | "SWITCH_MGMT" | "WIFI_MGMT";
};

export function QuickChangeIpModal({ assetId, currentIp, vlanType }: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    // Estados do Formulário
    const [isManualMode, setIsManualMode] = useState(false);
    const [manualIpValue, setManualIpValue] = useState("");
    const [selectedNetworkId, setSelectedNetworkId] = useState("");
    const [selectedIpId, setSelectedIpId] = useState("");

    // Estados de Erro
    const [submitError, setSubmitError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<
        { [key: string]: string[] } | undefined
    >(undefined);

    const resetForm = () => {
        setIsManualMode(false);
        setManualIpValue("");
        setSelectedNetworkId("");
        setSelectedIpId("");
        setSubmitError("");
        setFieldErrors(undefined);
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            resetForm();
        }
    };

    const handleConfirm = async () => {
        setIsPending(true);
        setSubmitError("");
        setFieldErrors(undefined);

        let targetIpId: string | null = null;

        if (isManualMode) {
            // 1. Validação local de formato IP (IPv4)
            const validationResult =
                ipValidationSchema.safeParse(manualIpValue);
            if (!validationResult.success) {
                setFieldErrors({
                    newIpAddress: [validationResult.error.issues[0].message],
                });
                setIsPending(false);
                return;
            }

            // 2. Consulta a nova rota via Server Action
            const ipLookup = await findIpByAddressAction(
                manualIpValue,
                vlanType,
            );

            // ✅ AJUSTADO: Verifica a flag `success` retornada pela nova Server Action
            if (!ipLookup.success || !ipLookup.data?.id) {
                setFieldErrors({
                    newIpAddress: [
                        ipLookup.error ||
                            "Endereço IP indisponível ou fora do escopo.",
                    ],
                });
                setIsPending(false);
                return;
            }

            // Captura o UUID retornado pela rota /api/ip-addresses/verify
            targetIpId = ipLookup.data.id;
        } else {
            targetIpId =
                selectedNetworkId === "REMOVE_IP" ? null : selectedIpId;
        }

        // 3. Atualiza o ativo via Action de Conectividade
        const result = await updateAssetConnectivityAction(assetId, {
            newIpId: targetIpId,
        });

        if (!result.success) {
            if (result.fieldErrors) {
                setFieldErrors(result.fieldErrors);
            } else {
                setSubmitError(
                    result.error || "Erro ao salvar as alterações de IP.",
                );
            }
            setIsPending(false);
        } else {
            setIsPending(false);
            setOpen(false);
            resetForm();
            router.refresh();
        }
    };

    const isSaveDisabled = isManualMode
        ? !manualIpValue.trim()
        : !selectedIpId && selectedNetworkId !== "REMOVE_IP";

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs gap-2 h-9 border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all shadow-sm"
                >
                    <RefreshCw
                        size={13}
                        className="text-emerald-600 dark:text-emerald-400"
                    />
                    Alterar Endereço IP
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-110 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl gap-0 p-0 overflow-hidden">
                <div className="p-6 bg-zinc-50/60 dark:bg-zinc-900/30 border-b border-zinc-100 dark:border-zinc-900">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                            <Network size={18} className="text-emerald-500" />{" "}
                            Gerenciador de Conectividade
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 dark:text-zinc-400 pt-1">
                            Selecione uma sugestão ou defina manualmente o
                            endereço IP.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-5">
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/80 p-3.5 rounded-xl flex items-center justify-between">
                        <div className="space-y-0.5">
                            <span className="text-[11px] uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500 block">
                                Endereço IP Atual
                            </span>
                            <span className="font-mono text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                {currentIp || "Nenhum IP Vinculado"}
                            </span>
                        </div>
                    </div>

                    <NetworkSelectorFields
                        vlanType={vlanType}
                        selectedNetworkId={selectedNetworkId}
                        onNetworkChange={setSelectedNetworkId}
                        selectedIpId={selectedIpId}
                        onIpChange={setSelectedIpId}
                        isManualMode={isManualMode}
                        setIsManualMode={setIsManualMode}
                        manualIpValue={manualIpValue}
                        onManualIpChange={setManualIpValue}
                        fieldErrors={fieldErrors}
                    />

                    {selectedNetworkId === "REMOVE_IP" && !isManualMode && (
                        <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl flex items-start gap-2.5">
                            <AlertTriangle
                                size={16}
                                className="text-amber-500 shrink-0 mt-0.5"
                            />
                            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                                O ativo constará como *&quot;Sem IP&quot;* até
                                que ocorra uma nova alocação.
                            </p>
                        </div>
                    )}

                    {/* Uso do FieldError nativo para erros globais da API */}
                    {submitError && (
                        <div className="pt-1">
                            <FieldError errors={[submitError]} />
                        </div>
                    )}
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-900 flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        disabled={isPending}
                        className="text-zinc-700 dark:text-zinc-300"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isSaveDisabled || isPending}
                        className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-semibold shadow"
                    >
                        {isPending ? "Processando..." : "Gravar Alteração"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
