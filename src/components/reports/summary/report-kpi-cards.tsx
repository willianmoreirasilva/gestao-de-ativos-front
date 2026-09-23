import { Boxes, Globe, ShieldAlert, Wifi } from "lucide-react";

interface ReportKpiCardsProps {
    summary: {
        totalAssets: number;
        withIp: number;
        withoutIp: number;
        departmentsCount: number;
    };
}

export function ReportKpiCards({ summary }: ReportKpiCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border p-5 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Total de Ativos
                    </p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                        {summary.totalAssets}
                    </p>
                </div>
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg border border-blue-500/20">
                    <Boxes className="w-6 h-6" />
                </div>
            </div>

            <div className="bg-card border border-border p-5 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Com Endereço IP
                    </p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                        {summary.withIp}
                    </p>
                </div>
                <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-500/20">
                    <Globe className="w-6 h-6" />
                </div>
            </div>

            <div className="bg-card border border-border p-5 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Sem Endereço IP
                    </p>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                        {summary.withoutIp}
                    </p>
                </div>
                <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg border border-amber-500/20">
                    <ShieldAlert className="w-6 h-6" />
                </div>
            </div>

            <div className="bg-card border border-border p-5 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Setores Atendidos
                    </p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                        {summary.departmentsCount}
                    </p>
                </div>
                <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg border border-purple-500/20">
                    <Wifi className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}
