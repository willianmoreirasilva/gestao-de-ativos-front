"use client";

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PaginationProps = {
    // Props do modo completo
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    itemLabel?: string; // Ex: "ativos", "registros", "relatórios"

    // Props para tabelas controladas por estado (ex: ReportTable)
    onPageChange?: (page: number) => void;
    onLimitChange?: (limit: number) => void;

    // Props para compatibilidade retroativa (modo legado)
    disablePrev?: boolean;
    disableNext?: boolean;
};

export function Pagination({
    total,
    page: propPage,
    limit: propLimit,
    totalPages: propTotalPages,
    itemLabel = "registros",
    onPageChange,
    onLimitChange,
    disablePrev,
    disableNext,
}: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Lê os query params de URL como fallback
    const urlPage = parseInt(searchParams.get("page") || "1", 10);
    const urlLimit = parseInt(
        searchParams.get("limit") || String(propLimit || 10),
        10,
    );

    const currentPage = propPage ?? urlPage;
    const currentLimit = propLimit ?? urlLimit;

    // Se total e totalPages não forem informados, opera no modo legado/simplificado
    const isLegacyMode = total === undefined || propTotalPages === undefined;

    const calculatedTotalPages = isLegacyMode
        ? disableNext
            ? currentPage
            : currentPage + 1
        : propTotalPages;

    const canGoPrev = isLegacyMode ? !disablePrev : currentPage > 1;
    const canGoNext = isLegacyMode
        ? !disableNext
        : currentPage < calculatedTotalPages;

    const updateParams = (newParams: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            params.set(key, value);
        });
        router.push(`${pathname}?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && (isLegacyMode || newPage <= calculatedTotalPages)) {
            if (onPageChange) {
                onPageChange(newPage);
            } else {
                updateParams({ page: String(newPage) });
            }
        }
    };

    const handleLimitChange = (newLimit: string) => {
        const numericLimit = Number(newLimit);
        if (onLimitChange) {
            onLimitChange(numericLimit);
        } else {
            updateParams({ limit: String(numericLimit), page: "1" });
        }
    };

    // Cálculos do intervalo de exibição (ex: "1–7 de 73")
    const startItem =
        total === 0 || total === undefined
            ? 0
            : (currentPage - 1) * currentLimit + 1;
    const endItem =
        total === undefined ? 0 : Math.min(currentPage * currentLimit, total);

    // Esconde o componente se não houver registros para exibir no modo legado
    if (isLegacyMode && disablePrev && disableNext && currentPage === 1) {
        return null;
    }

    // 🟢 MATEMÁTICA REFINADA DAS OPÇÕES DE EXIBIÇÃO:
    // Identifica o limite baixo base da página (sub-25)
    const initialLowLimit =
        currentLimit < 25
            ? currentLimit
            : propLimit && propLimit < 25
              ? propLimit
              : 8;

    // Se o limite inicial for menor que 5 (ex: 4), mantemos o 10 na lista.
    // Se estiver entre 5 e 24 (ex: 5 ou 8), o 10 é substituído por esse valor.
    const baseList =
        initialLowLimit < 5
            ? [initialLowLimit, 10, 25, 50, 100]
            : [initialLowLimit, 25, 50, 100];

    // Ordena os valores e garante que não existam duplicatas
    const selectOptions = Array.from(new Set(baseList)).sort((a, b) => a - b);

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 border border-border/80 bg-card px-4 py-2.5 rounded-xl text-xs transition-colors shadow-xs">
            {/* Esquerda: Contador de Registros */}
            <div className="text-muted-foreground font-medium">
                {!isLegacyMode ? (
                    <>
                        Exibindo{" "}
                        <strong className="text-foreground font-semibold">
                            {startItem}–{endItem}
                        </strong>{" "}
                        de{" "}
                        <strong className="text-foreground font-semibold">
                            {total}
                        </strong>{" "}
                        {itemLabel}
                    </>
                ) : (
                    <>
                        Página{" "}
                        <strong className="text-foreground font-semibold">
                            {currentPage}
                        </strong>
                    </>
                )}
            </div>

            {/* Direita: Seletor de limite e Controles de Navegação */}
            <div className="flex items-center gap-4">
                {/* Registros por página (Seletor) */}
                {!isLegacyMode && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span>Exibir:</span>
                        <select
                            value={currentLimit}
                            onChange={(e) => handleLimitChange(e.target.value)}
                            className="bg-background border border-border rounded-lg px-2 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer font-medium"
                        >
                            {selectOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Divisor Visual */}
                {!isLegacyMode && (
                    <div className="h-4 w-[1px] bg-border/60 hidden sm:block" />
                )}

                {/* Indicador e Botões */}
                <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">
                        Pág.{" "}
                        <strong className="text-foreground font-semibold">
                            {calculatedTotalPages === 0 ? 0 : currentPage}
                        </strong>{" "}
                        de{" "}
                        <strong className="text-foreground font-semibold">
                            {calculatedTotalPages}
                        </strong>
                    </span>

                    <div className="flex items-center gap-1">
                        {!isLegacyMode && (
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={!canGoPrev}
                                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                title="Primeira página"
                            >
                                <ChevronsLeft className="h-3.5 w-3.5" />
                            </button>
                        )}

                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!canGoPrev}
                            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            title="Página anterior"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                        </button>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!canGoNext}
                            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            title="Próxima página"
                        >
                            <ChevronRight className="h-3.5 w-3.5" />
                        </button>

                        {!isLegacyMode && (
                            <button
                                onClick={() =>
                                    handlePageChange(calculatedTotalPages)
                                }
                                disabled={!canGoNext}
                                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                title="Última página"
                            >
                                <ChevronsRight className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
