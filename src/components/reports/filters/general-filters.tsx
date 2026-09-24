"use client";

import { Search } from "lucide-react";
import React, { useMemo } from "react";

import { ComboboxSearch } from "@/components/ui/combobox-search";
import { ReportOptions } from "@/types/report-options";

import { ReportTypeSelector } from "../report-type-selector";

interface GeneralFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    ipStatus: string;
    onIpStatusChange: (status: string) => void;
    selectedTypes: string[];
    onSelectedTypesChange: (types: string[]) => void;
    departmentId: string;
    onDepartmentIdChange: (id: string) => void;
    locationId: string;
    onLocationIdChange: (id: string) => void;
    networkId: string;
    onNetworkIdChange: (id: string) => void;
    connectedToSwitchId: string;
    onConnectedToSwitchIdChange: (id: string) => void;
    options: ReportOptions;
}

export function GeneralFilters({
    search,
    onSearchChange,
    ipStatus,
    onIpStatusChange,
    selectedTypes,
    onSelectedTypesChange,
    departmentId,
    onDepartmentIdChange,
    locationId,
    onLocationIdChange,
    networkId,
    onNetworkIdChange,
    connectedToSwitchId,
    onConnectedToSwitchIdChange,
    options,
}: GeneralFiltersProps) {
    const departmentOptions = useMemo(
        () =>
            (options?.departments || []).map((d) => ({
                id: d.id,
                value: d.id,
                name: d.name,
                label: d.name,
            })),
        [options?.departments],
    );

    const locationOptions = useMemo(
        () =>
            (options?.locations || []).map((l) => ({
                id: l.id,
                value: l.id,
                name: l.name,
                label: l.name,
            })),
        [options?.locations],
    );

    const networkOptions = useMemo(
        () =>
            (options?.networks || []).map((n) => ({
                id: n.id,
                value: n.id,
                name: n.name,
                label: n.name,
            })),
        [options?.networks],
    );

    const switchOptions = useMemo(
        () =>
            (options?.switches || []).map((sw) => {
                const labelName = `${sw.hostname}${sw.model ? ` (${sw.model})` : ""}`;
                return {
                    id: sw.id,
                    value: sw.id,
                    name: labelName,
                    label: labelName,
                };
            }),
        [options?.switches],
    );

    return (
        <div className="space-y-4">
            {/* Campo de busca textual + Filtro rápido IP */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
                {/* Input de busca com fundo dinamico e suave */}
                <div className="relative w-full md:w-96">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar por Patrimônio, Hostname, Serial..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-background dark:bg-zinc-900/50 border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-xs"
                    />
                </div>

                {/* Seletor Toggle de IP com fundo neutro suave no Light Mode */}
                <div className="flex items-center bg-muted/60 dark:bg-zinc-900/80 p-1 rounded-xl border border-border/80 w-full md:w-auto">
                    <button
                        type="button"
                        onClick={() => onIpStatusChange("ALL")}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                            ipStatus === "ALL"
                                ? "bg-background text-foreground shadow-xs border border-border/50 font-semibold"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Todos
                    </button>
                    <button
                        type="button"
                        onClick={() => onIpStatusChange("true")}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                            ipStatus === "true"
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-semibold"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Com IP
                    </button>
                    <button
                        type="button"
                        onClick={() => onIpStatusChange("false")}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                            ipStatus === "false"
                                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-semibold"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Sem IP
                    </button>
                </div>
            </div>

            {/* Seleção de Tipos */}
            <ReportTypeSelector
                selectedTypes={selectedTypes}
                onChange={onSelectedTypesChange}
            />

            {/* Grid de Filtros Gerais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-border/60">
                <div>
                    <label className="text-[11px] font-medium text-muted-foreground mb-1 block">
                        Departamento
                    </label>
                    <ComboboxSearch
                        options={departmentOptions}
                        value={departmentId}
                        onChange={onDepartmentIdChange}
                        placeholder="Todos os Departamentos"
                        searchPlaceholder="Buscar departamento..."
                        emptyMessage="Nenhum departamento encontrado."
                    />
                </div>

                <div>
                    <label className="text-[11px] font-medium text-muted-foreground mb-1 block">
                        Unidade / Local
                    </label>
                    <ComboboxSearch
                        options={locationOptions}
                        value={locationId}
                        onChange={onLocationIdChange}
                        placeholder="Todas as Localidades"
                        searchPlaceholder="Buscar localidade..."
                        emptyMessage="Nenhuma localidade encontrada."
                    />
                </div>

                <div>
                    <label className="text-[11px] font-medium text-muted-foreground mb-1 block">
                        Rede / Sub-rede
                    </label>
                    <ComboboxSearch
                        options={networkOptions}
                        value={networkId}
                        onChange={onNetworkIdChange}
                        placeholder="Todas as Redes"
                        searchPlaceholder="Buscar rede..."
                        emptyMessage="Nenhuma rede encontrada."
                    />
                </div>

                <div>
                    <label className="text-[11px] font-medium text-muted-foreground mb-1 block">
                        Switch Concentrador
                    </label>
                    <ComboboxSearch
                        options={switchOptions}
                        value={connectedToSwitchId}
                        onChange={onConnectedToSwitchIdChange}
                        placeholder="Todos os Switches"
                        searchPlaceholder="Buscar switch..."
                        emptyMessage="Nenhum switch encontrado."
                    />
                </div>
            </div>
        </div>
    );
}
