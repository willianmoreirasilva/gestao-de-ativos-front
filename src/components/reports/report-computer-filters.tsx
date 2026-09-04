"use client";

import { Cpu } from "lucide-react";
import React from "react";

import { ComboboxSearch } from "@/components/ui/combobox-search";
import { OptionItem } from "@/types/assets";

interface ReportComputerFiltersProps {
    operatingSystems: OptionItem[];
    processors: OptionItem[];
    switches: OptionItem[];
    selectedOsId: string | null;
    selectedProcessorId: string | null;
    selectedSwitchId: string | null;
    onOsChange: (id: string | null) => void;
    onProcessorChange: (id: string | null) => void;
    onSwitchChange: (id: string | null) => void;
}

export function ReportComputerFilters({
    operatingSystems,
    processors,
    switches,
    selectedOsId,
    selectedProcessorId,
    selectedSwitchId,
    onOsChange,
    onProcessorChange,
    onSwitchChange,
}: ReportComputerFiltersProps) {
    return (
        <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200/60 dark:border-zinc-800 space-y-2 animate-in fade-in-50">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Cpu size={13} /> Especificações do Computador & Conectividade:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                        Sistema Operacional
                    </label>
                    <ComboboxSearch
                        options={operatingSystems}
                        value={selectedOsId}
                        onChange={(val) => onOsChange(val || null)}
                        placeholder="Todos os SOs"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                        Processador / CPU
                    </label>
                    <ComboboxSearch
                        options={processors}
                        value={selectedProcessorId}
                        onChange={(val) => onProcessorChange(val || null)}
                        placeholder="Todos os Processadores"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                        Switch Conectado
                    </label>
                    <ComboboxSearch
                        options={switches}
                        value={selectedSwitchId}
                        onChange={(val) => onSwitchChange(val || null)}
                        placeholder="Selecione o Switch"
                    />
                </div>
            </div>
        </div>
    );
}
