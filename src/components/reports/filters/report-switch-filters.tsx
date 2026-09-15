"use client";

import { HardDrive } from "lucide-react";
import React from "react";

interface ReportSwitchFiltersProps {
    model?: string;
    vendor?: string;
    totalPorts?: number;
    onChange: (field: string, val: any) => void;
}

export function ReportSwitchFilters({
    model,
    vendor,
    totalPorts,
    onChange,
}: ReportSwitchFiltersProps) {
    return (
        <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800 space-y-2">
            <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <HardDrive size={13} className="text-blue-400" /> Especificações
                do Switch
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="text-[10px] font-medium text-zinc-400 mb-1 block">
                        Fabricante
                    </label>
                    <input
                        type="text"
                        value={vendor || ""}
                        onChange={(e) =>
                            onChange("vendor", e.target.value || undefined)
                        }
                        placeholder="Ex: Cisco, Ubiquiti"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-medium text-zinc-400 mb-1 block">
                        Modelo
                    </label>
                    <input
                        type="text"
                        value={model || ""}
                        onChange={(e) =>
                            onChange("model", e.target.value || undefined)
                        }
                        placeholder="Ex: Catalyst 2960"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-medium text-zinc-400 mb-1 block">
                        Quantidade de Portas
                    </label>
                    <input
                        type="number"
                        value={totalPorts || ""}
                        onChange={(e) =>
                            onChange(
                                "totalPorts",
                                e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                            )
                        }
                        placeholder="Ex: 24, 48"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                    />
                </div>
            </div>
        </div>
    );
}
