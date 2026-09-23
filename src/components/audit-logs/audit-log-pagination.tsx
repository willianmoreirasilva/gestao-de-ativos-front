"use client";

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface AuditLogPaginationProps {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export function AuditLogPagination({
    total,
    page,
    limit,
    totalPages,
}: AuditLogPaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateParams = (newParams: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            params.set(key, value);
        });
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleLimitChange = (newLimit: string) => {
        updateParams({ limit: newLimit, page: "1" });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            updateParams({ page: String(newPage) });
        }
    };

    const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, total);

    return (
        <div className="border-t border-zinc-800 bg-zinc-900/40 px-4 py-3 rounded-b-xl space-y-3">
            {/* Linha Superior: Exibindo X-Y de Z e Seletor de Limite */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400">
                <div>
                    Exibindo{" "}
                    <strong className="text-zinc-200">
                        {startItem}–{endItem}
                    </strong>{" "}
                    de <strong className="text-zinc-200">{total}</strong>{" "}
                    registros
                </div>

                <div className="flex items-center gap-2">
                    <span>Registros por página:</span>
                    <select
                        value={limit}
                        onChange={(e) => handleLimitChange(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 focus:outline-none focus:border-zinc-700"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

            {/* Linha Inferior: Número de Páginas e Botões de Navegação */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
                <span className="text-xs text-zinc-400">
                    Página{" "}
                    <strong className="text-zinc-200">
                        {totalPages === 0 ? 0 : page}
                    </strong>{" "}
                    de <strong className="text-zinc-200">{totalPages}</strong>
                </span>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={page <= 1}
                        className="p-1.5 rounded border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title="Primeira página"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </button>

                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                        className="p-1.5 rounded border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title="Página anterior"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages}
                        className="p-1.5 rounded border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title="Próxima página"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>

                    <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={page >= totalPages}
                        className="p-1.5 rounded border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title="Última página"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
