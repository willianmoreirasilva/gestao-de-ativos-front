"use client";

import { Printer } from "lucide-react";
import React from "react";

interface ReportPrinterFiltersProps {
    printerModel?: string;
    model?: string; // Fallback de compatibilidade
    onChange: (field: string, val: string | undefined) => void;
}

export function ReportPrinterFilters({
    printerModel,
    model,
    onChange,
}: ReportPrinterFiltersProps) {
    // Garante leitura de qualquer uma das duas chaves passadas pelo pai
    const value = printerModel ?? model ?? "";

    return (
        <div className="p-3 bg-zinc-950/50 rounded-lg border border-zinc-800 space-y-2">
            <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Printer size={13} className="text-emerald-400" />{" "}
                Especificações da Impressora
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="text-[10px] font-medium text-zinc-400 mb-1 block">
                        Modelo da Impressora
                    </label>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                            onChange(
                                "printerModel",
                                e.target.value || undefined,
                            )
                        }
                        placeholder="Ex: LaserJet Pro M404"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                    />
                </div>
            </div>
        </div>
    );
}
