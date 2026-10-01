"use client";

import { Wifi } from "lucide-react";

import { NetworkUsageMetric } from "@/types/ip-address";

type IpNetworkUsageProps = {
    networksUsage: NetworkUsageMetric[];
};

export function IpNetworkUsage({ networksUsage }: IpNetworkUsageProps) {
    return (
        <div className="bg-card border border-border/60 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">
                        Utilização por Rede
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                        Distribuição de capacidade, reservas e disponibilidade
                    </p>
                </div>
                <span className="text-xs font-medium bg-muted px-2.5 py-1 rounded-md text-muted-foreground">
                    {networksUsage.length}{" "}
                    {networksUsage.length === 1 ? "Rede" : "Redes"}
                </span>
            </div>

            {networksUsage.length === 0 ? (
                <div className="py-10 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                    <Wifi className="h-6 w-6 mx-auto mb-2 opacity-40" />
                    Nenhuma sub-rede encontrada.
                </div>
            ) : (
                <div className="space-y-3.5 max-h-90 overflow-y-auto pr-1">
                    {networksUsage.map((net) => {
                        const pct = Math.min(net.usagePercentage || 0, 100);
                        const vlanDisplay =
                            net.vlanTag !== null && net.vlanTag !== undefined
                                ? `VLAN ${net.vlanTag}`
                                : "Sem VLAN";

                        return (
                            <div
                                key={net.id}
                                className="p-3.5 border border-border/40 bg-background/40 rounded-lg space-y-2"
                            >
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-foreground">
                                            {net.networkAddress}/{net.cidr}
                                        </span>
                                        <span className="text-[10px] bg-secondary text-secondary-foreground font-medium px-2 py-0.5 rounded">
                                            {vlanDisplay}
                                        </span>
                                        {net.type && (
                                            <span className="text-[10px] text-muted-foreground uppercase font-mono">
                                                ({net.type})
                                            </span>
                                        )}
                                    </div>
                                    <span className="font-mono font-bold text-foreground">
                                        {pct}%
                                    </span>
                                </div>

                                {/* Barra Multicor de Uso */}
                                <div className="w-full bg-muted/60 h-2.5 rounded-full overflow-hidden flex">
                                    <div
                                        className={`h-full transition-all duration-300 ${
                                            pct > 85
                                                ? "bg-destructive"
                                                : pct > 65
                                                  ? "bg-amber-500"
                                                  : "bg-primary"
                                        }`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono pt-0.5">
                                    <span>
                                        Em uso:{" "}
                                        <strong className="text-foreground">
                                            {net.used}
                                        </strong>
                                    </span>
                                    <span>
                                        Reservados:{" "}
                                        <strong className="text-amber-500">
                                            {net.reserved}
                                        </strong>
                                    </span>
                                    <span>
                                        Livres:{" "}
                                        <strong className="text-emerald-500">
                                            {net.available}
                                        </strong>
                                    </span>
                                    <span>
                                        Total:{" "}
                                        <strong className="text-foreground">
                                            {net.total}
                                        </strong>
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
