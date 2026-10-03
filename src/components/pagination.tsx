"use client";

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

type PaginationProps = {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    itemLabel?: string;
    onPageChange?: (page: number) => void;
    onLimitChange?: (limit: number) => void;
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

    const urlPage = parseInt(searchParams.get("page") || "1", 10);
    const urlLimit = parseInt(
        searchParams.get("limit") || String(propLimit || 10),
        10,
    );

    const currentPage = propPage ?? urlPage;
    const currentLimit = propLimit ?? urlLimit;

    // 🟢 GUARDA O LIMITE INICIAL APENAS NA PRIMEIRA RENDERIZAÇÃO
    const initialLimitRef = useRef<number | null>(null);
    if (initialLimitRef.current === null) {
        initialLimitRef.current = currentLimit;
    }

    const initialLimit = initialLimitRef.current;

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

    const startItem =
        total === 0 || total === undefined
            ? 0
            : (currentPage - 1) * currentLimit + 1;
    const endItem =
        total === undefined ? 0 : Math.min(currentPage * currentLimit, total);

    // 🟢 LÓGICA DAS OPÇÕES DO SELECT
    let optionsList: number[] = [];

    if (initialLimit <= 5) {
        // Se o limite inicial for <= 5 (ex: 3, 5), inclui o limite inicial E o 10: [initialLimit, 10, 25, 50, 100]
        optionsList = [initialLimit, 10, 25, 50, 100];
    } else if (initialLimit > 5 && initialLimit < 10) {
        // Se for entre 6 e 9 (ex: 8), substitui o 10 por ele: [initialLimit, 25, 50, 100]
        optionsList = [initialLimit, 25, 50, 100];
    } else {
        // Padrão do sistema
        optionsList = [10, 25, 50, 100];
    }

    // Garante que o limite selecionado atualmente (ex: se o usuário escolheu outro valor) também esteja na lista
    optionsList.push(currentLimit);

    // Remove duplicatas e ordena numericamente
    const selectOptions = Array.from(new Set(optionsList)).sort(
        (a, b) => a - b,
    );

    if (isLegacyMode && disablePrev && disableNext && currentPage === 1) {
        return null;
    }

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
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
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

                {!isLegacyMode && (
                    <div className="h-4 w-px bg-border/60 hidden sm:block" />
                )}

                <div className="flex items-center gap-3">
                    <span className="text-muted-foreground whitespace-nowrap">
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
