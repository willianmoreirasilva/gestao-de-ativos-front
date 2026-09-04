"use client";

import {
    Box,
    Camera,
    Globe,
    Monitor,
    Network,
    Phone,
    Printer,
    Search,
    ShieldAlert,
    Wifi,
} from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ComboboxSearch } from "@/components/ui/combobox-search";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OptionItem } from "@/types/assets";

import { ReportComputerFilters } from "./report-computer-filters";

const ASSET_TYPE_ICONS: Record<
    string,
    { label: string; icon: React.ReactNode }
> = {
    COMPUTER: { label: "Computador", icon: <Monitor size={14} /> },
    PRINTER: { label: "Impressora", icon: <Printer size={14} /> },
    PHONE: { label: "Telefone", icon: <Phone size={14} /> },
    SWITCH: { label: "Switch", icon: <Network size={14} /> },
    ACCESS_POINT: { label: "Access Point", icon: <Wifi size={14} /> },
    CAMERA: { label: "Câmera", icon: <Camera size={14} /> },
};

interface ReportFiltersProps {
    search: string;
    onSearchChange: (val: string) => void;
    ipStatus: "ALL" | "true" | "false";
    onIpStatusChange: (val: "ALL" | "true" | "false") => void;
    selectedTypes: string[];
    onToggleType: (type: string) => void;
    onClearTypes: () => void;

    // Listas de Opções dos Comboboxes
    departments: OptionItem[];
    locations: OptionItem[];
    networks: OptionItem[];
    operatingSystems: OptionItem[];
    processors: OptionItem[];
    switches: OptionItem[];

    // Valores Selecionados
    departmentId: string | null;
    locationId: string | null;
    networkId: string | null;
    selectedOsId: string | null;
    selectedProcessorId: string | null;
    selectedSwitchId: string | null;

    // Handlers
    onDepartmentChange: (id: string | null) => void;
    onLocationChange: (id: string | null) => void;
    onNetworkChange: (id: string | null) => void;
    onOsChange: (id: string | null) => void;
    onProcessorChange: (id: string | null) => void;
    onSwitchChange: (id: string | null) => void;
}

export function ReportFilters({
    search,
    onSearchChange,
    ipStatus,
    onIpStatusChange,
    selectedTypes,
    onToggleType,
    onClearTypes,
    departments,
    locations,
    networks,
    operatingSystems,
    processors,
    switches,
    departmentId,
    locationId,
    networkId,
    selectedOsId,
    selectedProcessorId,
    selectedSwitchId,
    onDepartmentChange,
    onLocationChange,
    onNetworkChange,
    onOsChange,
    onProcessorChange,
    onSwitchChange,
}: ReportFiltersProps) {
    const isComputerSelected =
        selectedTypes.includes("COMPUTER") || selectedTypes.length === 0;

    return (
        <Card className="border-zinc-200/80 dark:border-zinc-800 p-4 space-y-4">
            {/* 1. Busca por Texto + Tabs Status de IP */}
            <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por Patrimônio, Hostname, Serial..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 h-9 text-xs"
                    />
                </div>

                <Tabs
                    value={ipStatus}
                    onValueChange={(val) => onIpStatusChange(val as any)}
                    className="w-full sm:w-auto"
                >
                    <TabsList className="grid grid-cols-3 h-9 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 p-1 rounded-lg w-full sm:w-[320px]">
                        <TabsTrigger
                            value="ALL"
                            className="text-xs font-semibold gap-1.5 px-3 py-1 rounded-md"
                        >
                            <Box size={14} className="opacity-70" />
                            <span>Todos</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="true"
                            className="text-xs font-semibold gap-1.5 px-3 py-1 rounded-md data-[state=active]:text-emerald-600"
                        >
                            <Globe size={14} className="opacity-70" />
                            <span>Com IP</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="false"
                            className="text-xs font-semibold gap-1.5 px-3 py-1 rounded-md data-[state=active]:text-amber-600"
                        >
                            <ShieldAlert size={14} className="opacity-70" />
                            <span>Sem IP</span>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* 2. Ícones de Seleção Múltipla dos Tipos de Ativo */}
            <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Tipos de Ativos:
                </span>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(ASSET_TYPE_ICONS).map(
                        ([typeKey, { label, icon }]) => {
                            const isSelected = selectedTypes.includes(typeKey);
                            return (
                                <Button
                                    key={typeKey}
                                    type="button"
                                    variant={isSelected ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onToggleType(typeKey)}
                                    className={`h-8 gap-1.5 text-xs transition-all ${
                                        isSelected
                                            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                                            : ""
                                    }`}
                                >
                                    {icon}
                                    {label}
                                </Button>
                            );
                        },
                    )}
                    {selectedTypes.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearTypes}
                            className="h-8 text-xs text-muted-foreground"
                        >
                            Limpar seleção
                        </Button>
                    )}
                </div>
            </div>

            {/* 3. Comboboxes de Relacionamento Geral */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                    <label className="text-[11px] font-medium text-muted-foreground mb-1 block">
                        Departamento
                    </label>
                    <ComboboxSearch
                        options={departments}
                        value={departmentId}
                        onChange={(val) => onDepartmentChange(val || null)}
                        placeholder="Todos os Departamentos"
                    />
                </div>

                <div>
                    <label className="text-[11px] font-medium text-muted-foreground mb-1 block">
                        Unidade / Local
                    </label>
                    <ComboboxSearch
                        options={locations}
                        value={locationId}
                        onChange={(val) => onLocationChange(val || null)}
                        placeholder="Todas as Localidades"
                    />
                </div>

                <div>
                    <label className="text-[11px] font-medium text-muted-foreground mb-1 block">
                        Rede / Subrede
                    </label>
                    <ComboboxSearch
                        options={networks}
                        value={networkId}
                        onChange={(val) => onNetworkChange(val || null)}
                        placeholder="Todas as Redes"
                    />
                </div>
            </div>

            {/* 4. Filtros de Computador */}
            {isComputerSelected && (
                <ReportComputerFilters
                    operatingSystems={operatingSystems}
                    processors={processors}
                    switches={switches}
                    selectedOsId={selectedOsId}
                    selectedProcessorId={selectedProcessorId}
                    selectedSwitchId={selectedSwitchId}
                    onOsChange={onOsChange}
                    onProcessorChange={onProcessorChange}
                    onSwitchChange={onSwitchChange}
                />
            )}
        </Card>
    );
}
