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
        <div className="border border-border/80 border-t-0 bg-card px-4 py-3 rounded-b-2xl space-y-3 transition-colors shadow-xs">
            {/* Linha Superior */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
                <div>
                    Exibindo{" "}
                    <strong className="text-foreground">
                        {startItem}–{endItem}
                    </strong>{" "}
                    de <strong className="text-foreground">{total}</strong>{" "}
                    registros
                </div>

                <div className="flex items-center gap-2">
                    <span>Registros por página:</span>
                    <select
                        value={limit}
                        onChange={(e) => handleLimitChange(e.target.value)}
                        className="bg-background border border-border rounded-lg px-2 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

            {/* Linha Inferior */}
            <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-xs text-muted-foreground">
                    Página{" "}
                    <strong className="text-foreground">
                        {totalPages === 0 ? 0 : page}
                    </strong>{" "}
                    de <strong className="text-foreground">{totalPages}</strong>
                </span>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={page <= 1}
                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        title="Primeira página"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </button>

                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        title="Página anterior"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages}
                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        title="Próxima página"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>

                    <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={page >= totalPages}
                        className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        title="Última página"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
