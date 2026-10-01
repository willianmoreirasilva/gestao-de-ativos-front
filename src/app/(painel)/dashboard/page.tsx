import { AlertCircle } from "lucide-react";

import { DashboardActivitySummary } from "@/components/dashboard/dashboard-activity-summary";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardKpiCards } from "@/components/dashboard/dashboard-kpi-cards";
import { DashboardNetworkUsage } from "@/components/dashboard/dashboard-network-usage";
import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions";
import { dashboardService } from "@/services/dashboard-service";
import { AuditPeriod } from "@/types/dashboard";

export const revalidate = 0;

type DashboardPageProps = {
    searchParams: Promise<{ period?: AuditPeriod }>;
};

export default async function DashboardPage({
    searchParams,
}: DashboardPageProps) {
    const resolvedParams = await searchParams;
    const period = resolvedParams.period || "7d";

    const { data, error } =
        await dashboardService.getExecutiveDashboard(period);

    if (error || !data) {
        return (
            <div className="p-6">
                <div className="flex items-center gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p>
                        {error ||
                            "Erro desconhecido ao carregar o painel executivo."}
                    </p>
                </div>
            </div>
        );
    }

    const { infra, audit } = data;

    return (
        <div className="p-6 space-y-6 max-w-(--breakpoint-2xl) mx-auto text-foreground">
            <DashboardHeader currentPeriod={period} />

            <DashboardKpiCards
                totalAssets={audit.summary.totalAssets}
                totalNetworks={infra.summary.totalNetworks}
                totalDepartments={infra.summary.totalDepartments}
                totalLocations={infra.summary.totalLocations}
            />

            <DashboardNetworkUsage
                summary={infra.summary}
                networksUsage={infra.networksUsage}
            />

            <DashboardActivitySummary audit={audit} />

            <DashboardQuickActions />
        </div>
    );
}
