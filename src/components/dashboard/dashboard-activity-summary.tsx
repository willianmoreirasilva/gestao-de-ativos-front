import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { AuditDashboardData } from "@/types/dashboard";

type DashboardActivitySummaryProps = {
    audit: AuditDashboardData;
};

export function DashboardActivitySummary({
    audit,
}: DashboardActivitySummaryProps) {
    const { summary, recentLogs, operationsSummary, topUsers } = audit;

    // Helper para extrair o nome do utilizador com segurança
    const getUserDisplayName = (userObj: any): string => {
        if (!userObj) return "Sistema";
        if (typeof userObj === "string") return userObj;
        return userObj.name || userObj.email || userObj.id || "Desconhecido";
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Resumo do Inventário de Ativos */}
            <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                    Inventário de Ativos
                </h3>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-border/40 bg-background/40 rounded-lg text-xs">
                        <span className="text-muted-foreground font-medium">
                            Ativos Vinculados a IP
                        </span>
                        <span className="font-mono font-bold text-foreground">
                            {summary.withIp}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-border/40 bg-background/40 rounded-lg text-xs">
                        <span className="text-muted-foreground font-medium">
                            Ativos sem Endereço IP
                        </span>
                        <span className="font-mono font-bold text-foreground">
                            {summary.withoutIp}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-border/40 bg-background/40 rounded-lg text-xs">
                        <span className="text-muted-foreground font-medium">
                            Total de Ativos Mapeados
                        </span>
                        <span className="font-mono font-bold text-primary">
                            {summary.totalAssets}
                        </span>
                    </div>
                </div>

                {operationsSummary && operationsSummary.length > 0 && (
                    <div className="pt-2 border-t border-border/40">
                        <p className="text-[11px] font-semibold text-muted-foreground mb-2">
                            Operações do Período
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {operationsSummary.map((op, idx) => (
                                <span
                                    key={idx}
                                    className="text-[10px] bg-muted px-2 py-1 rounded-md font-mono font-medium"
                                >
                                    {op.action}:{" "}
                                    <strong className="text-foreground">
                                        {op.count}
                                    </strong>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Atividade Recente */}
            <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">
                        Atividade Recente
                    </h3>
                    <Link
                        href="/audit-logs"
                        className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
                    >
                        Ver todos
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {!recentLogs || recentLogs.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                        Nenhuma atividade registrada no período.
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {recentLogs.slice(0, 4).map((log: any) => (
                            <div
                                key={log.id}
                                className="p-2.5 border border-border/40 bg-background/40 rounded-lg text-xs flex items-center justify-between"
                            >
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-foreground uppercase text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                            {log.action}
                                        </span>
                                        <span className="font-medium text-foreground">
                                            {log.entity}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">
                                        por {getUserDisplayName(log.user)}
                                    </p>
                                </div>
                                <span className="text-[10px] font-mono text-muted-foreground">
                                    {log.timestamp}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Utilizadores mais Ativos */}
            <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">
                        Usuários mais Ativos
                    </h3>
                </div>

                {!topUsers || topUsers.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                        Sem registros no período selecionado.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {topUsers.slice(0, 4).map((u: any, idx: number) => {
                            const name = getUserDisplayName(
                                u.user || u.userName || u,
                            );
                            const count = u.operationsCount ?? u.count ?? 0;

                            return (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-2.5 border border-border/30 rounded-lg text-xs"
                                >
                                    <span className="font-medium text-foreground">
                                        {name}
                                    </span>
                                    <span className="font-mono bg-muted px-2 py-0.5 rounded text-[11px] font-semibold">
                                        {count} op.
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
