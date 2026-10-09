"use client";

import { ChevronDown, ChevronUp, Network } from "lucide-react";
import { useState } from "react";

import { DashboardActivitySummary } from "@/components/dashboard/dashboard-activity-summary";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardKpiCards } from "@/components/dashboard/dashboard-kpi-cards";
import { DashboardNetworkUsage } from "@/components/dashboard/dashboard-network-usage";
import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions";
import { Button } from "@/components/ui/button";
import { AuditPeriod, ExecutiveDashboardData } from "@/types/dashboard";

type DashboardClientViewProps = {
    data: ExecutiveDashboardData;
    period: AuditPeriod;
};

export function DashboardClientView({
    data,
    period,
}: DashboardClientViewProps) {
    const [showNetworkUsage, setShowNetworkUsage] = useState(false);
    const { infra, audit } = data;

    return (
        <div className="p-6 space-y-6 max-w-(--breakpoint-2xl) mx-auto text-foreground">
            {/* Header com Filtro de Período */}
            <DashboardHeader currentPeriod={period} />

            {/* KPIs Principais */}
            <DashboardKpiCards
                totalAssets={audit.summary.totalAssets}
                totalNetworks={infra.summary.totalNetworks}
                totalDepartments={infra.summary.totalDepartments}
                totalLocations={infra.summary.totalLocations}
            />

            {/* Ações Rápidas e Atalhos */}
            <DashboardQuickActions />

            {/* Seção Retrátil: Utilização por Rede */}
            <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
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
                    <div className="animate-in fade-in-50 slide-in-from-top-2 duration-200">
                        <DashboardNetworkUsage
                            summary={infra.summary}
                            networksUsage={infra.networksUsage}
                        />
                    </div>
                )}
            </div>

            {/* Resumo de Atividades e Usuários Ativos */}
            <DashboardActivitySummary audit={audit} />
        </div>
    );
}
