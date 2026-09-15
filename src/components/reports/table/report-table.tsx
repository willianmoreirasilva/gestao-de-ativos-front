"use client";

import React from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/users/pagination";

interface ReportTableProps {
    data: any[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    isLoading: boolean;
}

export function ReportTable({ data, meta, isLoading }: ReportTableProps) {
    const disablePrev = meta.page <= 1;
    const disableNext = meta.page >= meta.totalPages || meta.totalPages === 0;

    return (
        <Card className="border-zinc-200/80 dark:border-zinc-800 overflow-hidden p-4">
            <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs text-muted-foreground">
                <span>
                    Exibindo <strong>{data.length}</strong> de{" "}
                    <strong>{meta.total}</strong> ativos
                </span>
                <span>
                    Página <strong>{meta.page}</strong> de{" "}
                    <strong>{meta.totalPages || 1}</strong>
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                    <thead className="bg-zinc-50 dark:bg-zinc-900 text-zinc-500 font-medium uppercase border-b border-zinc-200/60 dark:border-zinc-800">
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
                                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors"
                                >
                                    <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                                        {asset.patrimony || "S/N"}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">
                                        {asset.computer?.hostname ||
                                            asset.printer?.serial ||
                                            asset.phone?.phoneNumber ||
                                            "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant="outline"
                                            className="text-[10px] font-semibold"
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
                                                className="text-zinc-400 border-dashed"
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

            {/* Componente de Paginação integrado */}
            <Pagination disablePrev={disablePrev} disableNext={disableNext} />
        </Card>
    );
}
