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
    const value = printerModel ?? model ?? "";

    return (
        <div className="p-3.5 bg-muted/30 rounded-xl border border-border/80 space-y-2.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Printer
                    size={13}
                    className="text-emerald-600 dark:text-emerald-400"
                />{" "}
                Especificações da Impressora
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
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
                        className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground/60 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
            </div>
        </div>
    );
}
