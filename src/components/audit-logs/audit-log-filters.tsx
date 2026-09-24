"use client";

import { RotateCcw, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

const ACTIONS = [
    { label: "Criou", value: "CREATE" },
    { label: "Atualizou", value: "UPDATE" },
    { label: "Excluiu", value: "DELETE" },
    { label: "Login", value: "LOGIN" },
    { label: "Logout", value: "LOGOUT" },
];

const ENTITY_OPTIONS = [
    { value: "USER", label: "Usuário" },
    { value: "DEPARTMENT", label: "Departamento" },
    { value: "LOCATION", label: "Localidade" },
    { value: "SWITCH", label: "Switch" },
    { value: "COMPUTER", label: "Computador" },
    { value: "PRINTER", label: "Impressora" },
    { value: "PHONE", label: "Telefone" },
    { value: "CAMERA", label: "Câmera" },
    { value: "ACCESS_POINT", label: "Ponto de Acesso (Wi-Fi)" },
    { value: "OTHER", label: "Outros Ativos" },
];

export function AuditLogFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [action, setAction] = useState(searchParams.get("action") || "");
    const [entity, setEntity] = useState(searchParams.get("entity") || "");
    const [startDate, setStartDate] = useState(
        searchParams.get("startDate") || "",
    );
    const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

    const createQueryString = useCallback(
        (paramsToUpdate: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", "1");

            Object.entries(paramsToUpdate).forEach(([key, value]) => {
                if (value) {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }
            });

            return params.toString();
        },
        [searchParams],
    );

    const handleFilterChange = (key: string, value: string) => {
        const query = createQueryString({ [key]: value || null });
        startTransition(() => {
            router.push(`${pathname}?${query}`);
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange("search", search);
    };

    const handleClearFilters = () => {
        setSearch("");
        setAction("");
        setEntity("");
        setStartDate("");
        setEndDate("");

        const params = new URLSearchParams();
        const limit = searchParams.get("limit");
        if (limit) params.set("limit", limit);

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    const hasActiveFilters = Boolean(
        search || action || entity || startDate || endDate,
    );

    return (
        <div className="space-y-3 mb-4 bg-card border border-border/80 p-4 rounded-2xl shadow-xs transition-colors">
            {/* Primeira Linha: Busca + Selects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <form onSubmit={handleSearchSubmit} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Pesquisar por detalhes, ID ou usuário..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                handleFilterChange("search", "");
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </form>

                {/* Filtro por Ação */}
                <select
                    value={action}
                    onChange={(e) => {
                        setAction(e.target.value);
                        handleFilterChange("action", e.target.value);
                    }}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                >
                    <option value="">Todas as Ações</option>
                    {ACTIONS.map((act) => (
                        <option key={act.value} value={act.value}>
                            {act.label}
                        </option>
                    ))}
                </select>

                {/* Filtro por Entidade */}
                <select
                    value={entity}
                    onChange={(e) => {
                        setEntity(e.target.value);
                        handleFilterChange("entity", e.target.value);
                    }}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                >
                    <option value="">Todas as Entidades</option>
                    {ENTITY_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>

                {/* Botão de Pesquisar */}
                <button
                    onClick={handleSearchSubmit}
                    disabled={isPending}
                    className="w-full py-2 px-4 text-xs sm:text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                    <Search className="h-4 w-4" />
                    Filtrar
                </button>
            </div>

            {/* Segunda Linha: Datas + Limpar Filtros */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-medium">
                            De:
                        </span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                handleFilterChange("startDate", e.target.value);
                            }}
                            className="px-3 py-1.5 text-xs bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-medium">
                            Até:
                        </span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                handleFilterChange("endDate", e.target.value);
                            }}
                            className="px-3 py-1.5 text-xs bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                        />
                    </div>
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={handleClearFilters}
                        className="text-xs font-semibold text-muted-foreground hover:text-destructive flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Limpar filtros
                    </button>
                )}
            </div>
        </div>
    );
}
