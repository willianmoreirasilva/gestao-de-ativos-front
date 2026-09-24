"use client";

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import React from "react";

interface ReportPaginationProps {
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    isPending?: boolean;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

export function ReportPagination({
    meta,
    isPending = false,
    onPageChange,
    onLimitChange,
}: ReportPaginationProps) {
    const startRecord = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
    const endRecord = Math.min(meta.page * meta.limit, meta.total);

    return (
        <div className="bg-card border-t border-border rounded-b-2xl overflow-hidden transition-colors">
            <div className="px-4 py-3 sm:px-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
                {/* Contagem de registros */}
                <div>
                    Exibindo{" "}
                    <span className="text-foreground font-semibold">
                        {startRecord}–{endRecord}
                    </span>{" "}
                    de{" "}
                    <span className="text-foreground font-semibold">
                        {meta.total}
                    </span>{" "}
                    ativos
                </div>

                {/* Seleção de Limite e Controles de Navegação */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span>Exibir:</span>
                        <select
                            value={meta.limit}
                            onChange={(e) =>
                                onLimitChange(parseInt(e.target.value, 10))
                            }
                            className="bg-background border border-border text-foreground rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-1.5 border-l border-border/60 pl-4">
                        <span className="mr-1 text-[11px]">
                            Pág.{" "}
                            <strong className="text-foreground">
                                {meta.page}
                            </strong>{" "}
                            de{" "}
                            <strong className="text-foreground">
                                {meta.totalPages || 1}
                            </strong>
                        </span>

                        <button
                            type="button"
                            onClick={() => onPageChange(1)}
                            disabled={meta.page <= 1 || isPending}
                            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                            title="Primeira Página"
                        >
                            <ChevronsLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onPageChange(meta.page - 1)}
                            disabled={meta.page <= 1 || isPending}
                            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                            title="Página Anterior"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onPageChange(meta.page + 1)}
                            disabled={
                                meta.page >= meta.totalPages ||
                                isPending ||
                                meta.totalPages === 0
                            }
                            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                            title="Próxima Página"
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onPageChange(meta.totalPages)}
                            disabled={
                                meta.page >= meta.totalPages ||
                                isPending ||
                                meta.totalPages === 0
                            }
                            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                            title="Última Página"
                        >
                            <ChevronsRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
