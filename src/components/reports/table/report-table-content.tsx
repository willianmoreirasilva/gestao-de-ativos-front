"use client";

import React from "react";

import { Badge } from "@/components/ui/badge";
import type { AssetReportData } from "@/types/report";

interface ReportTableContentProps {
    data: AssetReportData[];
    isLoading?: boolean;
}

const TYPE_LABELS: Record<string, string> = {
    COMPUTER: "Computador",
    PRINTER: "Impressora",
    SWITCH: "Switch",
    CAMERA: "Câmera",
    PHONE: "Telefone IP",
    ACCESS_POINT: "Access Point",
    SERVER: "Servidor",
};

export function ReportTableContent({
    data,
    isLoading,
}: ReportTableContentProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
                <thead>
                    <tr className="border-b border-border bg-muted/50 text-muted-foreground font-semibold uppercase tracking-wider">
                        <th className="py-3 px-4">Patrimônio</th>
                        <th className="py-3 px-4">Ativo / Hostname</th>
                        <th className="py-3 px-4">Tipo</th>
                        <th className="py-3 px-4">Departamento</th>
                        <th className="py-3 px-4">Localidade</th>
                        <th className="py-3 px-4">Endereço IP</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-foreground">
                    {isLoading ? (
                        <tr>
                            <td
                                colSpan={6}
                                className="py-8 text-center text-muted-foreground font-medium"
                            >
                                Carregando relatório...
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={6}
                                className="py-8 text-center text-muted-foreground"
                            >
                                Nenhum ativo encontrado para os filtros
                                selecionados.
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => {
                            const ipAddress =
                                typeof item.ip === "object"
                                    ? item.ip?.address
                                    : item.ip || item.ipAddress;

                            const hostname =
                                item.computer?.hostname ||
                                item.printer?.hostname ||
                                item.camera?.hostname ||
                                item.switch?.hostname ||
                                item.phone?.phoneNumber ||
                                item.accessPoint?.ssid ||
                                item.name ||
                                "-";

                            return (
                                <tr
                                    key={item.id}
                                    className="hover:bg-muted/40 transition-colors"
                                >
                                    <td className="py-3 px-4 font-semibold text-foreground">
                                        {item.patrimony || "S/N"}
                                    </td>
                                    <td className="py-3 px-4 font-medium text-foreground">
                                        {hostname}
                                    </td>
                                    <td className="py-3 px-4">
                                        <Badge
                                            variant="outline"
                                            className="text-[10px] font-semibold bg-background"
                                        >
                                            {TYPE_LABELS[item.type] ||
                                                item.type}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4 text-muted-foreground">
                                        {item.department?.name || "-"}
                                    </td>
                                    <td className="py-3 px-4 text-muted-foreground">
                                        {item.location?.name || "-"}
                                    </td>
                                    <td className="py-3 px-4">
                                        {ipAddress ? (
                                            <Badge
                                                variant="secondary"
                                                className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 font-mono text-[11px]"
                                            >
                                                {ipAddress}
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="text-muted-foreground/60 border-dashed text-[10px]"
                                            >
                                                Sem IP
                                            </Badge>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
