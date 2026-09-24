"use client";

import { Filter, SlidersHorizontal, Trash2, X } from "lucide-react";
import React, { useState } from "react";

import { ReportAccessPointFilters } from "./filters/report-access-point-filters";
import { ReportComputerFilters } from "./filters/report-computer-filters";
import { ReportPrinterFilters } from "./filters/report-printer-filters";
import { ReportSwitchFilters } from "./filters/report-switch-filters";

interface ReportFiltersProps {
    options: {
        departments: { id: string; name: string }[];
        locations: { id: string; name: string }[];
        networks: { id: string; name: string }[];
        operatingSystems: { id: string; name: string }[];
        processors: { id: string; name: string }[];
        disks: { id: string; name: string }[];
    };
    filters: any;
    setFilters: React.Dispatch<React.SetStateAction<any>>;
    onApply: () => void;
    onClear: () => void;
}

export function ReportFilters({
    options,
    filters,
    setFilters,
    onApply,
    onClear,
}: ReportFiltersProps) {
    const [showSpecific, setShowSpecific] = useState(false);

    const toggleType = (typeId: string) => {
        setFilters((prev: any) => {
            const currentTypes: string[] = prev.types || [];
            const exists = currentTypes.includes(typeId);
            const newTypes = exists
                ? currentTypes.filter((t) => t !== typeId)
                : [...currentTypes, typeId];

            const newSpecific = { ...prev.specific };
            if (exists && newSpecific) {
                if (typeId === "COMPUTER") delete newSpecific.computer;
                if (typeId === "PRINTER") delete newSpecific.printer;
                if (typeId === "SWITCH") delete newSpecific.switch;
                if (typeId === "ACCESS_POINT") delete newSpecific.accessPoint;
                if (typeId === "CAMERA") delete newSpecific.camera;
                if (typeId === "PHONE") delete newSpecific.phone;
            }

            return { ...prev, types: newTypes, specific: newSpecific };
        });
    };

    const updateSpecific = (typeKey: string, field: string, value: any) => {
        setFilters((prev: any) => ({
            ...prev,
            specific: {
                ...prev.specific,
                [typeKey]: {
                    ...prev.specific?.[typeKey],
                    [field]: value,
                },
            },
        }));
    };

    const selectedTypes = filters.types || [];

    return (
        <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs transition-colors">
            {/* SELEÇÃO DE TIPOS */}
            <div>
                <span className="text-xs text-muted-foreground font-semibold block mb-2">
                    Tipos de Ativos (Seleção Múltipla)
                </span>
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: "COMPUTER", label: "Computador" },
                        { id: "PRINTER", label: "Impressora" },
                        { id: "SWITCH", label: "Switch" },
                        { id: "ACCESS_POINT", label: "Access Point" },
                        { id: "CAMERA", label: "Câmera" },
                        { id: "PHONE", label: "Telefone" },
                    ].map((type) => {
                        const isSelected = selectedTypes.includes(type.id);
                        return (
                            <button
                                key={type.id}
                                type="button"
                                onClick={() => toggleType(type.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                    isSelected
                                        ? "bg-primary/10 text-primary border-primary/30 shadow-xs"
                                        : "bg-background text-muted-foreground border-border hover:bg-muted/60 hover:text-foreground"
                                }`}
                            >
                                {type.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* FILTROS GERAIS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        Departamento
                    </label>
                    <select
                        value={filters.departmentId || ""}
                        onChange={(e) =>
                            setFilters((prev: any) => ({
                                ...prev,
                                departmentId: e.target.value || undefined,
                            }))
                        }
                        className="w-full bg-background border border-border text-foreground rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                    >
                        <option value="">Todos os Departamentos</option>
                        {options.departments?.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        Unidade / Local
                    </label>
                    <select
                        value={filters.locationId || ""}
                        onChange={(e) =>
                            setFilters((prev: any) => ({
                                ...prev,
                                locationId: e.target.value || undefined,
                            }))
                        }
                        className="w-full bg-background border border-border text-foreground rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                    >
                        <option value="">Todas as Localidades</option>
                        {options.locations?.map((l) => (
                            <option key={l.id} value={l.id}>
                                {l.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        Rede / Sub-rede
                    </label>
                    <select
                        value={filters.networkId || ""}
                        onChange={(e) =>
                            setFilters((prev: any) => ({
                                ...prev,
                                networkId: e.target.value || undefined,
                            }))
                        }
                        className="w-full bg-background border border-border text-foreground rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                    >
                        <option value="">Todas as Redes</option>
                        {options.networks?.map((n) => (
                            <option key={n.id} value={n.id}>
                                {n.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* BOTÃO TOGGLE DE ESPECIFICAÇÕES AVANÇADAS */}
            <div className="border-t border-border/60 pt-3">
                <button
                    type="button"
                    onClick={() => setShowSpecific((prev) => !prev)}
                    className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors my-1 cursor-pointer"
                >
                    <span>
                        {showSpecific
                            ? "− Ocultar Especificações"
                            : "+ Mais Filtros / Especificações Avançadas"}
                    </span>
                </button>

                {showSpecific && (
                    <div className="space-y-3 pt-3 animate-in fade-in duration-200">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                            <SlidersHorizontal
                                size={13}
                                className="text-primary"
                            />
                            <span>Filtros Específicos do Ativo</span>
                        </div>

                        {selectedTypes.length === 0 && (
                            <p className="text-xs text-muted-foreground italic p-3 bg-muted/30 rounded-xl border border-border/50">
                                Selecione um tipo de ativo acima para exibir
                                seus filtros específicos.
                            </p>
                        )}

                        {selectedTypes.includes("COMPUTER") && (
                            <ReportComputerFilters
                                operatingSystems={
                                    options.operatingSystems || []
                                }
                                processors={options.processors || []}
                                disks={options.disks || []}
                                selectedOsId={filters.specific?.computer?.osId}
                                selectedProcessorId={
                                    filters.specific?.computer?.processorId
                                }
                                selectedDiskId={
                                    filters.specific?.computer?.diskId
                                }
                                selectedRam={filters.specific?.computer?.memory}
                                onChange={(f, v) =>
                                    updateSpecific("computer", f, v)
                                }
                            />
                        )}

                        {selectedTypes.includes("PRINTER") && (
                            <ReportPrinterFilters
                                model={filters.specific?.printer?.model}
                                onChange={(f, v) =>
                                    updateSpecific("printer", f, v)
                                }
                            />
                        )}

                        {selectedTypes.includes("SWITCH") && (
                            <ReportSwitchFilters
                                vendor={filters.specific?.switch?.vendor}
                                model={filters.specific?.switch?.model}
                                totalPorts={
                                    filters.specific?.switch?.totalPorts
                                }
                                onChange={(f, v) =>
                                    updateSpecific("switch", f, v)
                                }
                            />
                        )}

                        {selectedTypes.includes("ACCESS_POINT") && (
                            <ReportAccessPointFilters
                                vendor={filters.specific?.accessPoint?.vendor}
                                model={filters.specific?.accessPoint?.model}
                                ssid={filters.specific?.accessPoint?.ssid}
                                frequencyBand={
                                    filters.specific?.accessPoint?.frequencyBand
                                }
                                onChange={(f, v) =>
                                    updateSpecific("accessPoint", f, v)
                                }
                            />
                        )}

                        {selectedTypes.includes("CAMERA") && (
                            <div className="p-3.5 bg-muted/30 border border-border/80 rounded-xl space-y-2.5">
                                <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 block uppercase tracking-wider">
                                    Especificações da Câmera
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Modelo"
                                        value={
                                            filters.specific?.camera?.model ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            updateSpecific(
                                                "camera",
                                                "model",
                                                e.target.value || undefined,
                                            )
                                        }
                                        className="bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground/60 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Número de Série"
                                        value={
                                            filters.specific?.camera?.serial ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            updateSpecific(
                                                "camera",
                                                "serial",
                                                e.target.value || undefined,
                                            )
                                        }
                                        className="bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground/60 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {selectedTypes.includes("PHONE") && (
                            <div className="p-3.5 bg-muted/30 border border-border/80 rounded-xl space-y-2.5">
                                <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 block uppercase tracking-wider">
                                    Especificações do Telefone
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Modelo do Aparelho"
                                        value={
                                            filters.specific?.phone?.model || ""
                                        }
                                        onChange={(e) =>
                                            updateSpecific(
                                                "phone",
                                                "model",
                                                e.target.value || undefined,
                                            )
                                        }
                                        className="bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground/60 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Número / Ramal"
                                        value={
                                            filters.specific?.phone
                                                ?.phoneNumber || ""
                                        }
                                        onChange={(e) =>
                                            updateSpecific(
                                                "phone",
                                                "phoneNumber",
                                                e.target.value || undefined,
                                            )
                                        }
                                        className="bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground/60 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div className="flex justify-between items-center pt-2 border-t border-border/60">
                <button
                    type="button"
                    onClick={onClear}
                    className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                >
                    <Trash2 size={13} /> Limpar
                </button>

                <button
                    type="button"
                    onClick={onApply}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium text-xs rounded-xl hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
                >
                    <Filter size={13} /> Aplicar Filtros
                </button>
            </div>
        </div>
    );
}

export interface FilterChip {
    key: string;
    label: string;
    value: string;
    onRemove: () => void;
}

interface ActiveChipsProps {
    chips: FilterChip[];
    onApply: () => void;
}

export function ActiveChips({ chips, onApply }: ActiveChipsProps) {
    if (chips.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-muted-foreground font-semibold">
                Filtros ativos:
            </span>
            {chips.map((chip) => (
                <span
                    key={chip.key}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-muted/80 text-foreground border border-border/80 shadow-2xs"
                >
                    <span className="text-muted-foreground font-normal">
                        {chip.label}:
                    </span>
                    <span>{chip.value}</span>
                    <button
                        type="button"
                        onClick={() => {
                            chip.onRemove();
                            setTimeout(() => onApply(), 50);
                        }}
                        className="hover:text-destructive text-muted-foreground transition-colors ml-0.5 cursor-pointer"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </span>
            ))}
        </div>
    );
}
