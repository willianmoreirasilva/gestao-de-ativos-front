"use client";

import { Box, Building2, Globe, ShieldAlert } from "lucide-react";
import React from "react";

import { Card, CardContent } from "@/components/ui/card";

interface ReportKpiCardsProps {
    total: number;
    withIp: number;
    withoutIp: number;
    departmentsCount: number;
}

export function ReportKpiCards({
    total,
    withIp,
    withoutIp,
    departmentsCount,
}: ReportKpiCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-zinc-200/80 dark:border-zinc-800">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase">
                            Total de Ativos
                        </p>
                        <h3 className="text-2xl font-bold mt-1">{total}</h3>
                    </div>
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-lg">
                        <Box size={20} />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-zinc-200/80 dark:border-zinc-800">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase">
                            Com Endereço IP
                        </p>
                        <h3 className="text-2xl font-bold mt-1 text-emerald-600">
                            {withIp}
                        </h3>
                    </div>
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-lg">
                        <Globe size={20} />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-zinc-200/80 dark:border-zinc-800">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase">
                            Sem Endereço IP
                        </p>
                        <h3 className="text-2xl font-bold mt-1 text-amber-600">
                            {withoutIp}
                        </h3>
                    </div>
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-lg">
                        <ShieldAlert size={20} />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-zinc-200/80 dark:border-zinc-800">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase">
                            Setores Atendidos
                        </p>
                        <h3 className="text-2xl font-bold mt-1">
                            {departmentsCount}
                        </h3>
                    </div>
                    <div className="p-2.5 bg-purple-50 dark:bg-purple-950/50 text-purple-600 rounded-lg">
                        <Building2 size={20} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
