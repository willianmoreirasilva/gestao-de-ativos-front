"use client";

import { Phone } from "lucide-react";
import React from "react";

interface ReportPhoneFiltersProps {
    hostname?: string;
    model?: string;
    phoneNumber?: string;
    onChange: (field: string, val: string | undefined) => void;
}

export function ReportPhoneFilters({
    hostname,
    model,
    phoneNumber,
    onChange,
}: ReportPhoneFiltersProps) {
    return (
        <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800 space-y-2">
            <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Phone size={13} className="text-emerald-400" /> Especificações
                do Telefone / Ramal
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="text-[10px] font-medium text-zinc-400 mb-1 block">
                        Hostname / Nome
                    </label>
                    <input
                        type="text"
                        value={hostname || ""}
                        onChange={(e) =>
                            onChange("hostname", e.target.value || undefined)
                        }
                        placeholder="Ex: TEL-RECEPCAO-01"
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
                        placeholder="Ex: GXP1625"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-medium text-zinc-400 mb-1 block">
                        Ramal / Número
                    </label>
                    <input
                        type="text"
                        value={phoneNumber || ""}
                        onChange={(e) =>
                            onChange("phoneNumber", e.target.value || undefined)
                        }
                        placeholder="Ex: 2001, 2002"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                    />
                </div>
            </div>
        </div>
    );
}
