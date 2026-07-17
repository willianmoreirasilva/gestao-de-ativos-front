"use client";

import { Hash, Link2, Network, Pencil, Terminal } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { OptionItem } from "@/types/assets";

import { SwitchConnectionEditModal } from "./components/switch-connection-edit-modal";
import { QuickChangeIpModal } from "./quick-change-ip-modal";

type VlanType = "GENERAL_DATA" | "CAMERA_VLAN" | "SWITCH_MGMT" | "WIFI_MGMT";

interface AssetConnectivityCardProps {
    assetId: string;
    ip?: { address: string } | null;
    vlanType: VlanType;
    vlanTag?: number | null; // 🌟 Propriedade adicionada para exibir a tag numérica
    connectedToSwitch?: {
        id: string;
        hostname?: string | null;
        model?: string | null;
        vendor?: string | null;
    } | null;
    switchPort?: string | null;
    switches: OptionItem[];
}

const vlanConfig: Record<VlanType, { label: string; className: string }> = {
    GENERAL_DATA: {
        label: "Rede Corporativa (Dados)",
        className:
            "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
    },
    CAMERA_VLAN: {
        label: "VLAN de Câmeras (CFTV)",
        className:
            "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
    },
    SWITCH_MGMT: {
        label: "Gerenciamento de Ativos",
        className:
            "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-900/50",
    },
    WIFI_MGMT: {
        label: "Infraestrutura Wi-Fi",
        className:
            "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50",
    },
};

export function AssetConnectivityCard({
    assetId,
    ip,
    vlanType,
    vlanTag,
    connectedToSwitch,
    switchPort,
    switches,
}: AssetConnectivityCardProps) {
    const currentVlan = vlanConfig[vlanType] || vlanConfig.GENERAL_DATA;
    const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);

    return (
        <TooltipProvider delayDuration={200}>
            <Card className="shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between h-full min-h-[280px]">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 py-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-bold tracking-wide uppercase text-zinc-500 flex items-center gap-2">
                        <Terminal size={16} className="text-emerald-500" />{" "}
                        Conectividade IP & Rede
                    </CardTitle>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                                onClick={() => setIsSwitchModalOpen(true)}
                            >
                                <Pencil size={14} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                            <p className="text-[10px] font-semibold">
                                Editar Porta/Switch
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </CardHeader>

                <CardContent className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                        {/* Endereço IP */}
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground block">
                                Endereço IPv4 Atribuído
                            </span>
                            {ip?.address ? (
                                <Badge
                                    variant="outline"
                                    className="text-sm font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/50 px-3 py-1"
                                >
                                    {ip.address}
                                </Badge>
                            ) : (
                                <Badge
                                    variant="destructive"
                                    className="text-xs font-semibold px-2.5 py-0.5"
                                >
                                    Sem Endereço IP
                                </Badge>
                            )}
                        </div>

                        {/* Escopo da VLAN com Tag */}
                        <div className="space-y-1.5">
                            <span className="text-xs text-muted-foreground block">
                                VLAN / Segmentação
                            </span>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Network
                                    size={14}
                                    className="text-zinc-400 shrink-0"
                                />
                                <Badge
                                    variant="outline"
                                    className={`text-xs font-medium px-2.5 py-0.5 rounded-md ${currentVlan.className}`}
                                >
                                    {currentVlan.label}
                                </Badge>

                                {vlanTag && (
                                    <Badge
                                        variant="secondary"
                                        className="text-[10px] font-mono font-bold flex items-center gap-0.5 h-5 px-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                                    >
                                        <Hash size={10} />
                                        Tag {vlanTag}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Conexão Switch & Porta */}
                        <div className="space-y-1.5 pt-2.5 border-t border-dashed border-zinc-100 dark:border-zinc-800">
                            <span className="text-xs text-muted-foreground block">
                                Switch Conectado
                            </span>
                            {connectedToSwitch ? (
                                <div className="flex items-start justify-between gap-2 text-sm bg-zinc-50/50 dark:bg-zinc-900/30 p-2 rounded-lg border border-zinc-100 dark:border-zinc-900">
                                    <div className="flex gap-2">
                                        <Link2
                                            size={15}
                                            className="text-blue-500 shrink-0 mt-0.5"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-zinc-800 dark:text-zinc-200 leading-tight">
                                                {connectedToSwitch.hostname ||
                                                    "Sem Hostname"}
                                            </span>
                                            {connectedToSwitch.model && (
                                                <span className="text-[10px] text-zinc-400 font-medium">
                                                    {connectedToSwitch.vendor
                                                        ? `${connectedToSwitch.vendor} `
                                                        : ""}
                                                    {connectedToSwitch.model}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <Badge
                                        variant="outline"
                                        className="font-mono text-xs font-bold shrink-0 bg-blue-500/5 text-blue-600 border-blue-500/15 dark:bg-blue-400/5 dark:text-blue-400 dark:border-blue-400/15"
                                    >
                                        Porta {switchPort || "N/A"}
                                    </Badge>
                                </div>
                            ) : (
                                <span className="text-xs text-zinc-400 italic">
                                    Sem conexão de Switch configurada.
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900">
                        <QuickChangeIpModal
                            assetId={assetId}
                            currentIp={ip?.address || null}
                            vlanType={vlanType}
                        />
                    </div>
                </CardContent>

                <SwitchConnectionEditModal
                    isOpen={isSwitchModalOpen}
                    onClose={() => setIsSwitchModalOpen(false)}
                    assetId={assetId}
                    currentSwitchId={connectedToSwitch?.id || null}
                    currentPort={switchPort || ""}
                    switches={switches}
                />
            </Card>
        </TooltipProvider>
    );
}
