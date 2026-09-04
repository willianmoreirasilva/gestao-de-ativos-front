"use client";

import React from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ReportTableProps {
    data: any[];
    total: number;
    isLoading: boolean;
}

export function ReportTable({ data, total, isLoading }: ReportTableProps) {
    return (
        <Card className="border-zinc-200/80 dark:border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs text-muted-foreground">
                <span>
                    Exibindo <strong>{data.length}</strong> de{" "}
                    <strong>{total}</strong> ativos
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                    <thead className="bg-zinc-50 dark:bg-zinc-900 text-zinc-500 font-medium uppercase border-b">
                        <tr>
                            <th className="px-4 py-3">Patrimônio</th>
                            <th className="px-4 py-3">Ativo / Hostname</th>
                            <th className="px-4 py-3">Tipo</th>
                            <th className="px-4 py-3">Departamento</th>
                            <th className="px-4 py-3">Localidade</th>
                            <th className="px-4 py-3">Endereço IP</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {isLoading ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center py-8 text-muted-foreground"
                                >
                                    Carregando relatório...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center py-8 text-muted-foreground"
                                >
                                    Nenhum ativo encontrado para os filtros
                                    selecionados.
                                </td>
                            </tr>
                        ) : (
                            data.map((asset) => (
                                <tr
                                    key={asset.id}
                                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                                >
                                    <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                                        {asset.patrimony || "S/N"}
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        {asset.computer?.hostname ||
                                            asset.model ||
                                            "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant="outline"
                                            className="text-[10px]"
                                        >
                                            {asset.type}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                                        {asset.department?.name || "-"}
                                    </td>
                                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                                        {asset.location?.name || "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                        {asset.ip?.address ? (
                                            <Badge
                                                variant="secondary"
                                                className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200/50"
                                            >
                                                {asset.ip.address}
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="text-zinc-400"
                                            >
                                                Sem IP
                                            </Badge>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
