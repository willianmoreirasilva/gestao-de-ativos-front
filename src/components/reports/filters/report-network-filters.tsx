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
        <div className="p-3.5 bg-muted/30 rounded-xl border border-border/80 space-y-2.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Network size={13} className="text-primary" /> Conectividade &
                Rede
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                        Rede / Sub-rede
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
