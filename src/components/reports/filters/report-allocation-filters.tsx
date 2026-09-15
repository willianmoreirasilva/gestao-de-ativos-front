"use client";

import { Building2 } from "lucide-react";
import React from "react";

import { ComboboxSearch } from "@/components/ui/combobox-search";
import { OptionItem } from "@/types/assets";

interface ReportAllocationFiltersProps {
    departments: OptionItem[];
    locations: OptionItem[];
    departmentId: string | null;
    locationId: string | null;
    onDepartmentChange: (id: string | null) => void;
    onLocationChange: (id: string | null) => void;
}

export function ReportAllocationFilters({
    departments,
    locations,
    departmentId,
    locationId,
    onDepartmentChange,
    onLocationChange,
}: ReportAllocationFiltersProps) {
    return (
        <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200/60 dark:border-zinc-800 space-y-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={13} /> Alocação & Setor:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                        Departamento
                    </label>
                    <ComboboxSearch
                        options={departments}
                        value={departmentId}
                        onChange={(val) => onDepartmentChange(val || null)}
                        placeholder="Todos os Departamentos"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                        Unidade / Local
                    </label>
                    <ComboboxSearch
                        options={locations}
                        value={locationId}
                        onChange={(val) => onLocationChange(val || null)}
                        placeholder="Todas as Localidades"
                    />
                </div>
            </div>
        </div>
    );
}
