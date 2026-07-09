"use client";

import { Network, Terminal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { QuickChangeIpModal } from "./quick-change-ip-modal";

// 🌟 Importamos as tipagens centrais de redes se preferir, ou mantemos explícito aqui
type VlanType = "GENERAL_DATA" | "CAMERA_VLAN" | "SWITCH_MGMT" | "WIFI_MGMT";

interface AssetConnectivityCardProps {
    assetId: string;
    ip?: { address: string } | null;
    vlanType: VlanType; // 🌟 Definida na prop do componente
}

// 🌟 Dicionário de estilos e nomes amigáveis para cada VLAN do sistema
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
}: AssetConnectivityCardProps) {
    // Busca a configuração correspondente ou cai no fallback seguro
    const currentVlan = vlanConfig[vlanType] || vlanConfig.GENERAL_DATA;

    return (
        <Card className="shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between h-full min-h-[260px]">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 py-4">
                <CardTitle className="text-sm font-bold tracking-wide uppercase text-zinc-500 flex items-center gap-2">
                    <Terminal size={16} className="text-emerald-500" />{" "}
                    Conectividade IP
                </CardTitle>
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

                    {/* 🌟 Campo Novo Substituindo o Patrimônio: Escopo da VLAN com Visual Estilizado */}
                    <div className="space-y-1.5">
                        <span className="text-xs text-muted-foreground block">
                            Escopo de Rede / Segmentação
                        </span>
                        <div className="flex items-center gap-2">
                            <Network
                                size={14}
                                className="text-zinc-400 dark:text-zinc-500 shrink-0"
                            />
                            <Badge
                                variant="outline"
                                className={`text-xs font-medium px-2.5 py-0.5 rounded-md ${currentVlan.className}`}
                            >
                                {currentVlan.label}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Botão de Modificação Rápida */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900">
                    <QuickChangeIpModal
                        assetId={assetId}
                        currentIp={ip?.address || null}
                        vlanType={vlanType}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
