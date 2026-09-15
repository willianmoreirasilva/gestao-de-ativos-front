"use client";

import { Wifi } from "lucide-react";
import React from "react";

interface ReportAccessPointFiltersProps {
    model?: string;
    vendor?: string;
    ssid?: string;
    frequencyBand?: string;
    onChange: (field: string, val: string | undefined) => void;
}

export function ReportAccessPointFilters({
    model,
    vendor,
    ssid,
    frequencyBand,
    onChange,
}: ReportAccessPointFiltersProps) {
    return (
        <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800 space-y-2">
            <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Wifi size={13} className="text-amber-400" /> Especificações do
                Access Point
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                        placeholder="Ex: Ubiquiti, TP-Link"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
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
                        placeholder="Ex: UniFi AP AC Pro"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-medium text-zinc-400 mb-1 block">
                        SSID
                    </label>
                    <input
                        type="text"
                        value={ssid || ""}
                        onChange={(e) =>
                            onChange("ssid", e.target.value || undefined)
                        }
                        placeholder="Ex: Wi-Fi Corporativo"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-medium text-zinc-400 mb-1 block">
                        Frequência / Banda
                    </label>
                    <input
                        type="text"
                        value={frequencyBand || ""}
                        onChange={(e) =>
                            onChange(
                                "frequencyBand",
                                e.target.value || undefined,
                            )
                        }
                        placeholder="Ex: 5GHz, Dual-Band"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
