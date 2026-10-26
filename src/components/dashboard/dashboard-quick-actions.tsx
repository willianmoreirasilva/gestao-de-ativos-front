"use client";

import { ArrowRight, FileText, Layers, ShieldAlert } from "lucide-react";
import Link from "next/link";

import { useCan } from "@/components/permission-provider";
import type { Action, Resource } from "@/lib/permissions";

type QuickAction = {
    title: string;
    description: string;
    href: string;
    icon: typeof Layers;
    color: string;
    bg: string;
    // Atalho só aparece para quem tem a permissão
    permission?: { resource: Resource; action: Action };
};

export function DashboardQuickActions() {
    const can = useCan();
    const allActions: QuickAction[] = [
        {
            title: "Visão Geral de IPs",
            description:
                "Gerencie disponibilidade, visualização e reservas de endereços IP.",
            href: "/dashboard/overview",
            icon: Layers,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "Construtor de Relatórios",
            description:
                "Gere relatórios customizados de ativos e utilização de rede.",
            href: "/reports-audit/reports",
            icon: FileText,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            permission: { resource: "cameraReports", action: "view" },
        },
        {
            title: "Logs de Operações",
            description:
                "Consulte o histórico detalhado de alterações e auditoria do sistema.",
            href: "/reports-audit/audit-logs",
            icon: ShieldAlert,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            permission: { resource: "auditLogs", action: "view" },
        },
    ];
    const actions = allActions.filter(
        (act) =>
            !act.permission ||
            can(act.permission.resource, act.permission.action),
    );

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
                Ações Rápidas e Atalhos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {actions.map((act) => {
                    const Icon = act.icon;
                    return (
                        <Link
                            key={act.href}
                            href={act.href}
                            className="group bg-card border border-border/60 hover:border-primary/40 p-4 rounded-xl shadow-xs transition-all flex flex-col justify-between space-y-3"
                        >
                            <div className="flex items-start justify-between">
                                <div
                                    className={`p-2.5 rounded-lg ${act.bg} ${act.color}`}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                                    {act.title}
                                </h4>
                                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                                    {act.description}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
