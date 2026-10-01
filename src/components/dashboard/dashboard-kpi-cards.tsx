import { Building2, Laptop, MapPin, Network } from "lucide-react";

type DashboardKpiCardsProps = {
    totalAssets: number;
    totalNetworks: number;
    totalDepartments: number;
    totalLocations: number;
};

export function DashboardKpiCards({
    totalAssets,
    totalNetworks,
    totalDepartments,
    totalLocations,
}: DashboardKpiCardsProps) {
    const kpis = [
        {
            title: "Total de Ativos",
            value: totalAssets,
            icon: Laptop,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "Total de Redes",
            value: totalNetworks,
            icon: Network,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            title: "Departamentos",
            value: totalDepartments,
            icon: Building2,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            title: "Locais / Unidades",
            value: totalLocations,
            icon: MapPin,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => {
                const Icon = kpi.icon;
                return (
                    <div
                        key={kpi.title}
                        className="bg-card border border-border/60 p-4 rounded-xl shadow-xs flex items-center justify-between gap-3"
                    >
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                                {kpi.title}
                            </p>
                            <p className="text-2xl font-bold tracking-tight text-foreground">
                                {kpi.value}
                            </p>
                        </div>
                        <div
                            className={`p-3 rounded-xl ${kpi.bg} ${kpi.color} shrink-0`}
                        >
                            <Icon className="h-5 w-5" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
