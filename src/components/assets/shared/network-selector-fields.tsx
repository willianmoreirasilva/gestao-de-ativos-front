"use client";

import { Keyboard, ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FieldError } from "@/components/users/field-error";
import { useAvailableIps } from "@/hooks/use-availableIps";

interface NetworkSelectorFieldsProps {
    vlanType: "GENERAL_DATA" | "CAMERA_VLAN" | "SWITCH_MGMT" | "WIFI_MGMT";
    selectedNetworkId: string;
    onNetworkChange: (id: string) => void;
    selectedIpId: string;
    onIpChange: (id: string) => void;
    isManualMode: boolean;
    setIsManualMode: (manual: boolean) => void;
    manualIpValue: string;
    onManualIpChange: (value: string) => void;
    fieldErrors?: { [key: string]: string[] };
}

export function NetworkSelectorFields({
    vlanType,
    selectedNetworkId,
    onNetworkChange,
    selectedIpId,
    onIpChange,
    isManualMode,
    setIsManualMode,
    manualIpValue,
    onManualIpChange,
    fieldErrors,
}: NetworkSelectorFieldsProps) {
    const {
        networks,
        isLoading,
        error: apiError,
    } = useAvailableIps(vlanType, 5, !isManualMode);

    const currentSelectedNetwork = networks.find(
        (n) => n.networkId === selectedNetworkId,
    );

    // Unifica erros de IP do modo manual
    const manualIpErrors =
        fieldErrors?.manualIpValue ||
        fieldErrors?.manualIpAddress ||
        fieldErrors?.newIpAddress ||
        fieldErrors?.ipAddress ||
        fieldErrors?.ip;

    // Unifica erros de IP do modo automático
    const autoIpErrors =
        fieldErrors?.selectedIpId || fieldErrors?.ipId || fieldErrors?.newIpId;

    return (
        <div className="space-y-4">
            {/* Botão Seletor de Modo */}
            <div className="flex justify-end">
                <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="text-[11px] h-auto p-0 text-zinc-500 dark:text-zinc-400 gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    onClick={() => {
                        setIsManualMode(!isManualMode);
                        onNetworkChange("");
                        onIpChange("");
                        onManualIpChange("");
                    }}
                >
                    {isManualMode ? (
                        <>
                            <ListFilter size={12} /> Usar sugestões da rede
                        </>
                    ) : (
                        <>
                            <Keyboard size={12} /> Digitar IP manualmente
                        </>
                    )}
                </Button>
            </div>

            {/* MODO MANUAL */}
            {isManualMode ? (
                <div className="space-y-1.5 animate-in fade-in duration-200">
                    <Label
                        htmlFor="manualIp"
                        className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                        Digitar Endereço IPv4
                    </Label>
                    <Input
                        id="manualIp"
                        placeholder="Ex: 192.168.1.15"
                        value={manualIpValue}
                        onChange={(e) => onManualIpChange(e.target.value)}
                        className={`font-mono h-10 bg-background text-foreground border-input focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 ${
                            manualIpErrors
                                ? "border-destructive focus-visible:ring-destructive/20"
                                : ""
                        }`}
                    />
                    {/* Renderiza erro de Zod ou da API */}
                    <FieldError errors={manualIpErrors} />
                </div>
            ) : (
                /* MODO AUTOMÁTICO */
                <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            1. Selecionar Escopo de Rede
                        </Label>

                        <Select
                            value={selectedNetworkId}
                            disabled={isLoading}
                            onValueChange={(val) => {
                                onNetworkChange(val);
                                onIpChange("");
                            }}
                        >
                            <SelectTrigger className="w-full h-10 text-xs font-medium bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                                <SelectValue
                                    placeholder={
                                        isLoading
                                            ? "Buscando topologia..."
                                            : "Escolha um segmento..."
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    value="REMOVE_IP"
                                    className="text-amber-600 dark:text-amber-400 font-medium text-xs cursor-pointer"
                                >
                                    ⚠️ Desvincular e deixar Sem IP
                                </SelectItem>
                                {networks.map((net) => (
                                    <SelectItem
                                        key={net.networkId}
                                        value={net.networkId}
                                        className="text-xs cursor-pointer"
                                    >
                                        {net.networkAddress}{" "}
                                        {net.vlanTag
                                            ? `• VLAN ${net.vlanTag}`
                                            : ""}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Bloco informativo da VLAN */}
                    {currentSelectedNetwork && (
                        <div className="flex items-center gap-2 p-2 px-3 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-800 rounded-lg">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                Segmento:
                            </span>
                            <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200">
                                {currentSelectedNetwork.networkAddress}
                            </span>
                            {currentSelectedNetwork.vlanTag && (
                                <span className="bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 rounded">
                                    VLAN {currentSelectedNetwork.vlanTag}
                                </span>
                            )}
                        </div>
                    )}

                    {/* SELECT 2: IPs Livres */}
                    {selectedNetworkId && selectedNetworkId !== "REMOVE_IP" && (
                        <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                            <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                2. Endereço IP Disponível
                            </Label>

                            <Select
                                value={selectedIpId}
                                onValueChange={(val) => onIpChange(val)}
                            >
                                <SelectTrigger className="w-full h-10 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                                    <SelectValue placeholder="Selecione o endereço final..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {currentSelectedNetwork?.availableIps.map(
                                        (ip) => (
                                            <SelectItem
                                                key={ip.id}
                                                value={ip.id}
                                                className="text-xs font-mono text-zinc-900 dark:text-zinc-100 cursor-pointer"
                                            >
                                                {ip.address}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>

                            {/* Renderiza erro de Zod ou da API */}
                            <FieldError errors={autoIpErrors} />
                        </div>
                    )}
                </div>
            )}

            {apiError && (
                <div className="text-xs font-semibold text-destructive bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-3 rounded-lg">
                    {apiError}
                </div>
            )}
        </div>
    );
}
