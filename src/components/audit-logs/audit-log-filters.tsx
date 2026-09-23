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

// Lista customizada sem Endereço IP (ipAddress) e com suporte a subtipos de ativos
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

    // Estados locais para controle instantâneo do formulário
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

            // Sempre reseta para a página 1 ao alterar filtros
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
        <div className="space-y-3 mb-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
            {/* Primeira Linha: Busca + Selects */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <form onSubmit={handleSearchSubmit} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Pesquisar por detalhes, ID ou usuário..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                handleFilterChange("search", "");
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
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
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 focus:outline-none focus:border-zinc-700"
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
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 focus:outline-none focus:border-zinc-700"
                >
                    <option value="">Todas as Entidades</option>
                    {ENTITY_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>

                {/* Botão de Pesquisar (Atalho) */}
                <button
                    onClick={handleSearchSubmit}
                    disabled={isPending}
                    className="w-full py-2 px-4 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <Search className="h-4 w-4" />
                    Filtrar
                </button>
            </div>

            {/* Segunda Linha: Datas + Limpar Filtros */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-zinc-800/60">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400">De:</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                handleFilterChange("startDate", e.target.value);
                            }}
                            className="px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 focus:outline-none focus:border-zinc-700"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400">Até:</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                handleFilterChange("endDate", e.target.value);
                            }}
                            className="px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 focus:outline-none focus:border-zinc-700"
                        />
                    </div>
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={handleClearFilters}
                        className="text-xs text-zinc-400 hover:text-rose-400 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-zinc-800/50 transition-colors"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Limpar filtros
                    </button>
                )}
            </div>
        </div>
    );
}
