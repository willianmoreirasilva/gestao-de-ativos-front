"use client";

import {
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Clock,
    Network,
    RefreshCw,
    Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useCan, useRole } from "@/components/permission-provider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { reservationNetworkTypes } from "@/lib/permissions";
import { NetworkOption, OverviewStatsResponse } from "@/types/ip-address";

import { IpNetworkUsage } from "./ip-network-usage";
import { IpOverviewStats } from "./ip-overview-stats";
import { AvailableIpsTab } from "./tabs/available-ips-tab";
import { FindAvailableIpsTab } from "./tabs/find-available-ips-tab";
import { ReservedIpsTab } from "./tabs/reserved-ips-tab";

type IpOverviewContainerProps = {
    // null para quem não vê estatísticas de uso (USER)
    initialStats: OverviewStatsResponse | null;
    // Redes onde a role procura IPs livres
    networks: NetworkOption[];
};

export function IpOverviewContainer({
    initialStats,
    networks: findNetworks,
}: IpOverviewContainerProps) {
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Estado para controlar especificamente a exibição da Utilização por Rede
    const [showNetworkUsage, setShowNetworkUsage] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.refresh();
        setTimeout(() => setIsRefreshing(false), 600);
    };

    const summary = initialStats?.summary || {
        total: 0,
        inUse: 0,
        available: 0,
        reserved: 0,
    };
    const networks = initialStats?.networksUsage || [];

    // Matriz de IPs (a API aplica as mesmas regras):
    // - encontrar IPs livres: todos (USER sem a VLAN de câmeras)
    // - uso, disponibilidade detalhada e reservas: SUPERADM e ADMIN em todas
    //   as redes; CAM_OPERATOR só nas redes de câmeras; USER, nada
    const can = useCan();
    const role = useRole();
    const canSeeUsage = can("ipUsage", "view") && !!initialStats;
    const canSeeReservations = can("ipReservations", "view");
    const allowedTypes = reservationNetworkTypes(role);
    const reservableNetworks = allowedTypes
        ? networks.filter((net) => allowedTypes.includes(net.type))
        : networks;
    const scopeLabel =
        role === "CAM_OPERATOR" ? " (somente VLAN de câmeras)" : "";

    return (
        <div className="p-6 space-y-6 max-w-(--breakpoint-2xl) mx-auto text-foreground">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Visão Geral de IPs
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {canSeeUsage
                            ? `Monitore a utilização das redes e gerencie a disponibilidade de endereços IP${scopeLabel}.`
                            : "Encontre endereços IP livres nas sub-redes."}
                    </p>
                </div>

                <Button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    variant="outline"
                    size="sm"
                    className="gap-2 cursor-pointer text-xs self-start sm:self-auto"
                >
                    <RefreshCw
                        className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                    />
                    Atualizar dados
                </Button>
            </div>

            {/* 1. KPIs (só para quem vê o uso; no escopo da role) */}
            {canSeeUsage && <IpOverviewStats summary={summary} />}

            {/* 2. BOTÃO + ÁREA DE UTILIZAÇÃO POR REDE (RETRÁTIL) */}
            {canSeeUsage && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Button
                            onClick={() => setShowNetworkUsage((prev) => !prev)}
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer p-0 h-auto"
                        >
                            <Network className="h-4 w-4" />
                            {showNetworkUsage
                                ? "Ocultar Utilização por Rede"
                                : "Ver Utilização por Rede (Distribuição e Capacidade)"}
                            {showNetworkUsage ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    {showNetworkUsage && (
                        <div className="animate-in fade-in-50 duration-200">
                            <IpNetworkUsage networksUsage={networks} />
                        </div>
                    )}
                </div>
            )}

            {/* 3. OPERAÇÃO DE IPs (ÁREA PRINCIPAL) */}
            <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
                <div className="border-b border-border/40 pb-3">
                    <h3 className="text-sm font-bold tracking-tight">
                        {canSeeUsage
                            ? "Operação de IPs"
                            : "Encontrar IPs livres"}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                        {canSeeUsage
                            ? `Encontre blocos livres, consulte a disponibilidade ou gerencie reservas ativas${scopeLabel}`
                            : "Busque endereços ou blocos sequenciais livres em uma sub-rede"}
                    </p>
                </div>

                {/* Sem uso nem reservas (USER): só a busca, sem abas */}
                {!canSeeUsage && !canSeeReservations ? (
                    <FindAvailableIpsTab
                        networks={findNetworks}
                        onRefreshAll={handleRefresh}
                    />
                ) : (
                    <Tabs defaultValue="find" className="space-y-4">
                        <TabsList className="bg-muted/50 p-1 rounded-lg">
                            <TabsTrigger
                                value="find"
                                className="text-xs gap-1.5 cursor-pointer"
                            >
                                <Search className="h-3.5 w-3.5" />
                                Encontrar IPs
                            </TabsTrigger>
                            {canSeeUsage && (
                                <TabsTrigger
                                    value="available"
                                    className="text-xs gap-1.5 cursor-pointer"
                                >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Disponíveis
                                </TabsTrigger>
                            )}
                            {canSeeReservations && (
                                <TabsTrigger
                                    value="reserved"
                                    className="text-xs gap-1.5 cursor-pointer"
                                >
                                    <Clock className="h-3.5 w-3.5" />
                                    Reservados
                                </TabsTrigger>
                            )}
                        </TabsList>

                        <TabsContent value="find">
                            <FindAvailableIpsTab
                                networks={findNetworks}
                                onRefreshAll={handleRefresh}
                            />
                        </TabsContent>

                        {canSeeUsage && (
                            <TabsContent value="available">
                                <AvailableIpsTab
                                    networks={networks}
                                    onRefreshAll={handleRefresh}
                                />
                            </TabsContent>
                        )}

                        {canSeeReservations && (
                            <TabsContent value="reserved">
                                <ReservedIpsTab
                                    networks={reservableNetworks}
                                    onRefreshAll={handleRefresh}
                                />
                            </TabsContent>
                        )}
                    </Tabs>
                )}
            </div>
        </div>
    );
}
