import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Activity,
    ArrowRight,
    FileText,
    History,
    LayoutGrid,
    ShieldCheck,
    Users,
} from "lucide-react";
import Link from "next/link";

import { getReportsAuditDashboardAction } from "@/actions/reports-audit-dashboard.action";
import { ReportKpiCards } from "@/components/reports/summary/report-kpi-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getFormattedEntity } from "@/lib/audit-utils";

export default async function ReportsAuditDashboardPage() {
    const { data, error } = await getReportsAuditDashboardAction();

    if (error || !data) {
        return (
            <div className="p-8 text-center text-destructive font-medium border border-destructive/20 bg-destructive/5 rounded-2xl m-8">
                {error ||
                    "Erro ao carregar o painel de Relatórios & Auditoria."}
            </div>
        );
    }

    const { summary, recentLogs, operationsSummary, topUsers } = data;
    const totalOperations = operationsSummary.reduce(
        (acc, curr) => acc + curr.count,
        0,
    );

    const getActionBadge = (action: string) => {
        switch (action) {
            case "CREATE":
                return (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
                        CREATE
                    </Badge>
                );
            case "UPDATE":
                return (
                    <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20">
                        UPDATE
                    </Badge>
                );
            case "DELETE":
                return (
                    <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20">
                        DELETE
                    </Badge>
                );
            default:
                return <Badge variant="outline">{action}</Badge>;
        }
    };

    return (
        <div className="space-y-8 p-8 max-w-400 mx-auto">
            {/* Header no padrão do sistema */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
                            <FileText size={26} />
                        </div>
                        Central de Relatórios & Auditoria
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Visão consolidada do inventário, consultas
                        personalizadas e histórico de auditoria.
                    </p>
                </div>
            </div>

            {/* KPIs Reutilizados do Inventário */}
            <ReportKpiCards summary={summary} />

            {/* Acesso Rápido */}
            <div className="grid gap-6 sm:grid-cols-2">
                <Card className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800/80 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                    <CardHeader className="p-6 pb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                <LayoutGrid size={22} />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                    Construtor de Relatórios
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Crie e exporte consultas customizadas do
                                    inventário.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                        <Button asChild className="w-full sm:w-auto mt-2">
                            <Link
                                href="/reports-audit/reports"
                                className="flex items-center gap-2"
                            >
                                Construir relatório
                                <ArrowRight size={16} />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800/80 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                    <CardHeader className="p-6 pb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20">
                                <History size={22} />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                    Logs de Operações
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Rastreie acessos, modificações e exclusões
                                    no sistema.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                        <Button
                            asChild
                            variant="secondary"
                            className="w-full sm:w-auto mt-2"
                        >
                            <Link
                                href="/reports-audit/audit-logs"
                                className="flex items-center gap-2"
                            >
                                Ver operações
                                <ArrowRight size={16} />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Painel de Atividades e Resumo Operacional */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Atividade Recente */}
                <Card className="lg:col-span-2 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800/80 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                    Atividade Recente
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Últimas ações registradas pela auditoria
                                </CardDescription>
                            </div>
                        </div>
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                        >
                            <Link href="/reports-audit/audit-logs">
                                Ver todos →
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                        {recentLogs.length === 0 ? (
                            <p className="text-center py-8 text-xs text-muted-foreground">
                                Nenhuma operação registrada recentemente.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {recentLogs.map((log) => {
                                    // Formata o nome da entidade usando a mesma regra da tabela de logs
                                    const entityName = getFormattedEntity(
                                        log as any,
                                    );

                                    return (
                                        <div
                                            key={log.id}
                                            className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900/80 pb-3 last:border-none last:pb-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                {getActionBadge(log.action)}
                                                <div>
                                                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                        {entityName}{" "}
                                                        <span className="text-xs text-muted-foreground font-mono">
                                                            #
                                                            {log.entityId.substring(
                                                                0,
                                                                8,
                                                            )}
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        por{" "}
                                                        <span className="font-medium text-foreground">
                                                            {log.user?.name ||
                                                                log.user
                                                                    ?.email ||
                                                                "Sistema"}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                {formatDistanceToNow(
                                                    new Date(log.createdAt),
                                                    {
                                                        addSuffix: true,
                                                        locale: ptBR,
                                                    },
                                                )}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Resumo de Operações e Usuários */}
                <div className="space-y-6">
                    <Card className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800/80 shadow-sm">
                        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-900">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                                <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                    Resumo de Ações
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {operationsSummary.map((op) => {
                                const percentage = totalOperations
                                    ? Math.round(
                                          (op.count / totalOperations) * 100,
                                      )
                                    : 0;

                                return (
                                    <div
                                        key={op.action}
                                        className="space-y-1.5"
                                    >
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span>{op.action}</span>
                                            <span className="text-muted-foreground">
                                                {op.count} ({percentage}%)
                                            </span>
                                        </div>
                                        <Progress
                                            value={percentage}
                                            className="h-1.5"
                                        />
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800/80 shadow-sm">
                        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-900">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-muted-foreground" />
                                <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                    Usuários Ativos
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                {topUsers.map((u, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between text-xs"
                                    >
                                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                            {u.userName}
                                        </span>
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px]"
                                        >
                                            {u.count} ops
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
