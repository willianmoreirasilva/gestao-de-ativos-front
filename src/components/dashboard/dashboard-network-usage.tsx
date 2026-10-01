import { InfraDashboardData } from "@/types/dashboard";

type DashboardNetworkUsageProps = {
    summary: InfraDashboardData["summary"];
    networksUsage: InfraDashboardData["networksUsage"];
};

export function DashboardNetworkUsage({
    summary,
    networksUsage,
}: DashboardNetworkUsageProps) {
    const totalIps = summary.totalIpsInUse + summary.totalIpsAvailable;
    const usagePercentage =
        totalIps > 0 ? Math.round((summary.totalIpsInUse / totalIps) * 100) : 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visão de IPs Consolidados */}
            <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                    Utilização Geral de Endereços IP
                </h3>

                <div className="space-y-2">
                    <div className="flex items-baseline justify-between text-xs font-medium">
                        <span className="text-muted-foreground">
                            Capacidade Mapeada
                        </span>
                        <span className="font-mono font-bold text-foreground">
                            {totalIps} IPs
                        </span>
                    </div>

                    <div className="w-full bg-muted/60 h-3 rounded-full overflow-hidden flex">
                        <div
                            className="bg-primary h-full transition-all duration-500"
                            style={{ width: `${usagePercentage}%` }}
                        />
                        <div
                            className="bg-emerald-500/30 h-full transition-all duration-500"
                            style={{ width: `${100 - usagePercentage}%` }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 border border-border/40 rounded-lg bg-background/50">
                        <p className="text-[11px] text-muted-foreground font-medium">
                            Em Uso
                        </p>
                        <p className="text-lg font-bold font-mono text-primary mt-0.5">
                            {summary.totalIpsInUse}
                        </p>
                    </div>
                    <div className="p-3 border border-border/40 rounded-lg bg-background/50">
                        <p className="text-[11px] text-muted-foreground font-medium">
                            Disponíveis
                        </p>
                        <p className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {summary.totalIpsAvailable}
                        </p>
                    </div>
                </div>
            </div>

            {/* Lista de Utilização por Sub-rede */}
            <div className="lg:col-span-2 bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold tracking-tight text-foreground">
                            Ocupação por Sub-rede
                        </h3>
                        <p className="text-[11px] text-muted-foreground">
                            Distribuição de capacidade e tráfego de IPs
                        </p>
                    </div>
                    <span className="text-xs font-medium bg-muted px-2.5 py-1 rounded-md text-muted-foreground">
                        {networksUsage.length}{" "}
                        {networksUsage.length === 1 ? "Rede" : "Redes"}
                    </span>
                </div>

                {networksUsage.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                        Nenhuma rede cadastrada no momento.
                    </div>
                ) : (
                    <div className="space-y-3.5 max-h-65 overflow-y-auto pr-1">
                        {networksUsage.map((net, idx) => {
                            const pct = Math.min(net.usagePercentage || 0, 100);
                            return (
                                <div
                                    key={idx}
                                    className="p-3 border border-border/40 bg-background/40 rounded-lg space-y-1.5"
                                >
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-foreground">
                                                {net.networkName}
                                            </span>
                                            {net.vlanTag && (
                                                <span className="text-[10px] bg-secondary text-secondary-foreground font-medium px-1.5 py-0.5 rounded">
                                                    VLAN {net.vlanTag}
                                                </span>
                                            )}
                                        </div>
                                        <span className="font-mono font-bold text-foreground">
                                            {pct}%
                                        </span>
                                    </div>

                                    <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 rounded-full ${
                                                pct > 85
                                                    ? "bg-destructive"
                                                    : pct > 65
                                                      ? "bg-amber-500"
                                                      : "bg-primary"
                                            }`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                                        <span>Utilizados: {net.used}</span>
                                        <span>
                                            Disponíveis: {net.available}
                                        </span>
                                        <span>Total: {net.total}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
