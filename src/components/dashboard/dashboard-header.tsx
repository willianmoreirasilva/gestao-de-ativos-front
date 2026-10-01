"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { AuditPeriod } from "@/types/dashboard";

export function DashboardHeader({
    currentPeriod,
}: {
    currentPeriod: AuditPeriod;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handlePeriodChange = (period: AuditPeriod) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("period", period);
        startTransition(() => {
            router.push(`/dashboard?${params.toString()}`);
        });
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Painel Principal de TI
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Visão executiva e consolidada da infraestrutura, ativos e
                    operações.
                </p>
            </div>

            <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-lg border border-border/50 self-start sm:self-auto">
                {(["today", "7d", "30d"] as AuditPeriod[]).map((p) => {
                    const labels: Record<AuditPeriod, string> = {
                        today: "Hoje",
                        "7d": "7 dias",
                        "30d": "30 dias",
                    };
                    const isActive = currentPeriod === p;

                    return (
                        <button
                            key={p}
                            onClick={() => handlePeriodChange(p)}
                            disabled={isPending}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                                isActive
                                    ? "bg-background text-foreground shadow-xs font-semibold"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {labels[p]}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
