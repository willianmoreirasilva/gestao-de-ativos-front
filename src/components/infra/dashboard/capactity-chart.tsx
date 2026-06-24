import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { NetworkUsageItem } from "@/types/infra-dashboard";

type Props = {
    inUse: number;
    available: number;
    networksUsage: NetworkUsageItem[];
};

export function CapacityChart({ inUse, available, networksUsage }: Props) {
    const totalGlobalIps = inUse + available;
    const globalPercentage =
        totalGlobalIps > 0 ? Math.round((inUse / totalGlobalIps) * 100) : 0;

    // Função que define a cor da mini-barra e do percentual de acordo com o consumo
    const getUsageTheme = (percentage: number) => {
        if (percentage >= 90)
            return {
                bar: "[&>div]:bg-rose-500 animate-pulse",
                text: "text-rose-600 dark:text-rose-400 font-bold",
            };
        if (percentage >= 70)
            return {
                bar: "[&>div]:bg-amber-500",
                text: "text-amber-600 dark:text-amber-400 font-semibold",
            };
        return {
            bar: "[&>div]:bg-blue-600 dark:[&>div]:bg-blue-500",
            text: "text-zinc-500 dark:text-zinc-400 font-medium",
        };
    };

    return (
        <Card className="shadow-sm border-zinc-200/80 dark:border-zinc-800 flex flex-col h-full bg-white dark:bg-zinc-950">
            <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    Capacidade e Alocação IP
                </CardTitle>
                <CardDescription>
                    Monitoramento em tempo real do escopo de rede corporativo.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
                {/* 📌 SEÇÃO GLOBAL COM CORES DE DESTAQUE */}
                <div className="space-y-3 bg-zinc-50 dark:bg-zinc-900/40 p-4 rounded-xl border border-zinc-100 dark:border-zinc-900/60 shadow-inner">
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                                IPs Ativos
                            </span>
                            <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                                {inUse}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                                IPs Disponíveis
                            </span>
                            <span className="text-2xl font-bold text-zinc-500 dark:text-zinc-400">
                                {available}
                            </span>
                        </div>
                    </div>

                    {/* Barra de progresso global elegante com degradê */}
                    <Progress
                        value={globalPercentage}
                        className="h-2.5 bg-zinc-200 dark:bg-zinc-800 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-indigo-600 dark:[&>div]:from-blue-500 dark:[&>div]:to-indigo-500"
                    />

                    <div className="text-right text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                        Infraestrutura operando com{" "}
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">
                            {globalPercentage}%
                        </span>{" "}
                        de ocupação geral (Total: {totalGlobalIps})
                    </div>
                </div>

                {/* 📌 LISTAGEM DE VLANS DE ALTA DENSIDADE */}
                <div className="space-y-3 flex-1 pt-2">
                    <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                        Uso Individual por Segmento
                    </h4>
                    <div className="max-h-[340px] overflow-y-auto pr-1 space-y-3 scrollbar-thin">
                        {networksUsage.map((net, idx) => {
                            const theme = getUsageTheme(net.usagePercentage);

                            return (
                                <div
                                    key={idx}
                                    className="space-y-2 pb-2.5 border-b border-zinc-100 dark:border-zinc-900/40 last:border-none group"
                                >
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {net.networkName}
                                            </span>
                                            {net.vlanTag && (
                                                <Badge className="text-[10px] px-1.5 py-0 font-bold border-none bg-indigo-50 text-indigo-600 hover:bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400">
                                                    VLAN {net.vlanTag}
                                                </Badge>
                                            )}
                                        </div>
                                        <span
                                            className={`text-xs ${theme.text}`}
                                        >
                                            {net.used} / {net.total} IPs (
                                            {net.usagePercentage}%)
                                        </span>
                                    </div>
                                    <Progress
                                        value={net.usagePercentage}
                                        className={`h-1.5 bg-zinc-100 dark:bg-zinc-800 transition-all ${theme.bar}`}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
