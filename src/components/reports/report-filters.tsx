"use client";

import { Filter, SlidersHorizontal, Trash2 } from "lucide-react";
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
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
            {/* SELEÇÃO DE TIPOS */}
            <div>
                <span className="text-xs text-zinc-400 font-medium block mb-2">
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
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                    isSelected
                                        ? "bg-indigo-950/80 text-indigo-300 border-indigo-700/60"
                                        : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200"
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
                    <label className="text-xs text-zinc-400 mb-1 block">
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
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200"
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
                    <label className="text-xs text-zinc-400 mb-1 block">
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
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200"
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
                    <label className="text-xs text-zinc-400 mb-1 block">
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
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200"
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
            <div className="border-t border-zinc-800/80 pt-3">
                <button
                    type="button"
                    onClick={() => setShowSpecific((prev) => !prev)}
                    className="flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors my-1"
                >
                    <span>
                        {showSpecific
                            ? "− Ocultar Especificações"
                            : "+ Mais Filtros / Especificações Avançadas"}
                    </span>
                </button>

                {showSpecific && (
                    <div className="space-y-3 pt-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                            <SlidersHorizontal size={13} />
                            <span>Filtros Específicos do Ativo</span>
                        </div>

                        {selectedTypes.length === 0 && (
                            <p className="text-xs text-zinc-500 italic p-2 bg-zinc-950/30 rounded border border-zinc-800/40">
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
                            <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-lg space-y-2">
                                <span className="text-[11px] font-semibold text-purple-400 block uppercase tracking-wide">
                                    Especificações da Câmera
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                                        className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded px-2.5 py-1.5"
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
                                        className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded px-2.5 py-1.5"
                                    />
                                </div>
                            </div>
                        )}

                        {selectedTypes.includes("PHONE") && (
                            <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-lg space-y-2">
                                <span className="text-[11px] font-semibold text-cyan-400 block uppercase tracking-wide">
                                    Especificações do Telefone
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                                        className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded px-2.5 py-1.5"
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
                                        className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded px-2.5 py-1.5"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                <button
                    type="button"
                    onClick={onClear}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-400 transition-colors"
                >
                    <Trash2 size={13} /> Limpar
                </button>

                <button
                    type="button"
                    onClick={onApply}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                >
                    <Filter size={13} /> Aplicar Filtros
                </button>
            </div>
        </div>
    );
}
