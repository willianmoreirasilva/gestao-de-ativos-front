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

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IpAddress, OverviewStatsResponse } from "@/types/ip-address";

import { CancelReservationDialog } from "./dialogs/cancel-reservation-dialog";
import { ReserveIpsDialog } from "./dialogs/reserve-ips-dialog";
import { IpNetworkUsage } from "./ip-network-usage";
import { IpOverviewStats } from "./ip-overview-stats";
import { AvailableIpsTab } from "./tabs/available-ips-tab";
import { FindAvailableIpsTab } from "./tabs/find-available-ips-tab";
import { ReservedIpsTab } from "./tabs/reserved-ips-tab";

type IpOverviewContainerProps = {
    initialStats: OverviewStatsResponse | null;
};

export function IpOverviewContainer({
    initialStats,
}: IpOverviewContainerProps) {
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Estado para controlar especificamente a exibição da Utilização por Rede
    const [showNetworkUsage, setShowNetworkUsage] = useState(false);

    // Estados dos Dialogs
    const [reserveState, setReserveState] = useState<{
        open: boolean;
        networkId: string;
        ips: string[];
    }>({
        open: false,
        networkId: "",
        ips: [],
    });
    const [cancelTarget, setCancelTarget] = useState<IpAddress | null>(null);

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

    return (
        <div className="p-6 space-y-6 max-w-(--breakpoint-2xl) mx-auto text-foreground">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Visão Geral de IPs
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Monitore a utilização das redes e gerencie a
                        disponibilidade de endereços IP.
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

            {/* 1. KPIs SEMPRE VISÍVEIS */}
            <IpOverviewStats summary={summary} />

            {/* 2. BOTÃO + ÁREA DE UTILIZAÇÃO POR REDE (RETRÁTIL) */}
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

            {/* 3. OPERAÇÃO DE IPs (ÁREA PRINCIPAL) */}
            <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
                <div className="border-b border-border/40 pb-3">
                    <h3 className="text-sm font-bold tracking-tight">
                        Operação de IPs
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                        Encontre blocos livres, consulte a disponibilidade ou
                        gerencie reservas ativas
                    </p>
                </div>

                <Tabs defaultValue="find" className="space-y-4">
                    <TabsList className="bg-muted/50 p-1 rounded-lg">
                        <TabsTrigger
                            value="find"
                            className="text-xs gap-1.5 cursor-pointer"
                        >
                            <Search className="h-3.5 w-3.5" />
                            Encontrar IPs
                        </TabsTrigger>
                        <TabsTrigger
                            value="available"
                            className="text-xs gap-1.5 cursor-pointer"
                        >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Disponíveis
                        </TabsTrigger>
                        <TabsTrigger
                            value="reserved"
                            className="text-xs gap-1.5 cursor-pointer"
                        >
                            <Clock className="h-3.5 w-3.5" />
                            Reservados
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="find">
                        <FindAvailableIpsTab
                            networks={networks}
                            onOpenReserveDialog={(networkId, ips) =>
                                setReserveState({ open: true, networkId, ips })
                            }
                        />
                    </TabsContent>

                    <TabsContent value="available">
                        <AvailableIpsTab
                            networks={networks}
                            onOpenReserveDialog={(networkId, ips) =>
                                setReserveState({ open: true, networkId, ips })
                            }
                        />
                    </TabsContent>

                    <TabsContent value="reserved">
                        <ReservedIpsTab
                            networks={networks}
                            onRefreshAll={handleRefresh}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Dialogs */}
            <ReserveIpsDialog
                open={reserveState.open}
                networkId={reserveState.networkId}
                ipAddresses={reserveState.ips}
                onClose={() =>
                    setReserveState({ open: false, networkId: "", ips: [] })
                }
                onSuccess={handleRefresh}
            />

            <CancelReservationDialog
                ip={cancelTarget}
                onClose={() => setCancelTarget(null)}
                onSuccess={handleRefresh}
            />
        </div>
    );
}
