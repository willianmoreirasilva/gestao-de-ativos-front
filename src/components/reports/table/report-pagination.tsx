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
    isPending: boolean;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

export function ReportPagination({
    meta,
    isPending,
    onPageChange,
    onLimitChange,
}: ReportPaginationProps) {
    const startRecord = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
    const endRecord = Math.min(meta.page * meta.limit, meta.total);

    return (
        <div className="bg-zinc-900 border-t border-zinc-800 rounded-b-xl overflow-hidden">
            {/* Header da Tabela / Registros por Página */}
            <div className="px-6 py-4 border-b border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-zinc-400">
                <div>
                    Exibindo{" "}
                    <span className="text-zinc-100 font-semibold">
                        {startRecord}–{endRecord}
                    </span>{" "}
                    de{" "}
                    <span className="text-zinc-100 font-semibold">
                        {meta.total}
                    </span>{" "}
                    ativos
                </div>
                <div className="flex items-center gap-2">
                    <span>Registros por página:</span>
                    <select
                        value={meta.limit}
                        onChange={(e) =>
                            onLimitChange(parseInt(e.target.value, 10))
                        }
                        className="bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 text-xs text-zinc-200 focus:outline-none"
                    >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
            </div>

            {/* Navegação de Páginas */}
            <div className="px-6 py-4 flex items-center justify-between">
                <div className="text-xs text-zinc-400">
                    Página{" "}
                    <span className="text-zinc-100 font-medium">
                        {meta.page}
                    </span>{" "}
                    de{" "}
                    <span className="text-zinc-100 font-medium">
                        {meta.totalPages}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => onPageChange(1)}
                        disabled={meta.page <= 1 || isPending}
                        className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40"
                    >
                        <ChevronsLeft className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onPageChange(meta.page - 1)}
                        disabled={meta.page <= 1 || isPending}
                        className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onPageChange(meta.page + 1)}
                        disabled={meta.page >= meta.totalPages || isPending}
                        className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onPageChange(meta.totalPages)}
                        disabled={meta.page >= meta.totalPages || isPending}
                        className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40"
                    >
                        <ChevronsRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
