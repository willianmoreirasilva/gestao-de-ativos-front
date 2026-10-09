import { AlertCircle } from "lucide-react";

import { DashboardClientView } from "@/components/dashboard/dashboard-client-view";
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

    return <DashboardClientView data={data} period={period} />;
}
