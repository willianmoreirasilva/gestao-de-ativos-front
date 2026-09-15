"use client";

import { Network } from "lucide-react";
import React from "react";

import { ComboboxSearch } from "@/components/ui/combobox-search";
import { OptionItem } from "@/types/assets";

interface ReportNetworkFiltersProps {
    networks: OptionItem[];
    switches: OptionItem[];
    networkId: string | null;
    selectedSwitchId: string | null;
    onNetworkChange: (id: string | null) => void;
    onSwitchChange: (id: string | null) => void;
}

export function ReportNetworkFilters({
    networks,
    switches,
    networkId,
    selectedSwitchId,
    onNetworkChange,
    onSwitchChange,
}: ReportNetworkFiltersProps) {
    return (
        <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200/60 dark:border-zinc-800 space-y-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Network size={13} /> Conectividade & Rede:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                        Rede / Subrede
                    </label>
                    <ComboboxSearch
                        options={networks}
                        value={networkId}
                        onChange={(val) => onNetworkChange(val || null)}
                        placeholder="Todas as Redes"
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
                        placeholder="Todos os Switches"
                    />
                </div>
            </div>
        </div>
    );
}
