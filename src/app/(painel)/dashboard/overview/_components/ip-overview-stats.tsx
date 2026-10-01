"use client";

import { CheckCircle2, Clock, Network, Server } from "lucide-react";

import { NetworkUsageMetric } from "@/types/ip-address";

type IpOverviewStatsProps = {
    summary: {
        total: number;
        inUse: number;
        available: number;
        reserved: number;
    };
};

export function IpOverviewStats({ summary }: IpOverviewStatsProps) {
    const total = summary.total || 0;
    const inUsePct =
        total > 0 ? ((summary.inUse / total) * 100).toFixed(1) : "0.0";
    const availPct =
        total > 0 ? ((summary.available / total) * 100).toFixed(1) : "0.0";
    const resPct =
        total > 0 ? ((summary.reserved / total) * 100).toFixed(1) : "0.0";

    const kpis = [
        {
            title: "Total de IPs",
            value: total.toLocaleString(),
            subtitle: "Todas as redes cadastradas",
            icon: Network,
            color: "text-foreground",
            bg: "bg-muted/80",
        },
        {
            title: "Em Uso",
            value: summary.inUse.toLocaleString(),
            subtitle: `${inUsePct}% do total`,
            icon: Server,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "Disponíveis",
            value: summary.available.toLocaleString(),
            subtitle: `${availPct}% do total`,
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            title: "Reservados",
            value: summary.reserved.toLocaleString(),
            subtitle: `${resPct}% do total`,
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                    <div
                        key={idx}
                        className="bg-card border border-border/60 p-4 rounded-xl shadow-xs flex items-center justify-between gap-3"
                    >
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                                {kpi.title}
                            </p>
                            <p className="text-2xl font-bold tracking-tight text-foreground">
                                {kpi.value}
                            </p>
                            <p className="text-[11px] text-muted-foreground/80 font-mono">
                                {kpi.subtitle}
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
