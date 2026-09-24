"use client";

import { Cpu, HardDrive, MemoryStick } from "lucide-react";
import React from "react";

import { ComboboxSearch } from "@/components/ui/combobox-search";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ReportComputerFiltersProps {
    operatingSystems: { id: string; name: string }[];
    processors: { id: string; name: string }[];
    disks: { id: string; name: string }[];
    selectedOsId?: string;
    selectedProcessorId?: string;
    selectedDiskId?: string;
    selectedRam?: string;
    onChange: (field: string, val: string | undefined) => void;
}

export function ReportComputerFilters({
    operatingSystems,
    processors,
    disks,
    selectedOsId,
    selectedProcessorId,
    selectedDiskId,
    selectedRam,
    onChange,
}: ReportComputerFiltersProps) {
    return (
        <div className="p-3.5 bg-muted/30 rounded-xl border border-border/80 space-y-2.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Cpu size={13} className="text-primary" /> Especificações do
                Computador
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                        Sistema Operacional
                    </label>
                    <ComboboxSearch
                        options={operatingSystems}
                        value={selectedOsId || null}
                        onChange={(val) => onChange("osId", val || undefined)}
                        placeholder="Todos os SOs"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                        Processador / CPU
                    </label>
                    <ComboboxSearch
                        options={processors}
                        value={selectedProcessorId || null}
                        onChange={(val) =>
                            onChange("processorId", val || undefined)
                        }
                        placeholder="Todos os Processadores"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <HardDrive size={12} /> Armazenamento
                    </label>
                    <ComboboxSearch
                        options={disks}
                        value={selectedDiskId || null}
                        onChange={(val) => onChange("diskId", val || undefined)}
                        placeholder="Todos os Discos"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <MemoryStick size={12} /> Memória RAM
                    </label>
                    <Select
                        value={selectedRam || "ALL"}
                        onValueChange={(val) =>
                            onChange("memory", val === "ALL" ? undefined : val)
                        }
                    >
                        <SelectTrigger className="h-9 text-xs bg-background border-border text-foreground rounded-lg">
                            <SelectValue placeholder="Todas as Memórias" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border text-popover-foreground">
                            <SelectItem value="ALL">
                                Todas as Memórias
                            </SelectItem>
                            {[
                                "1GB",
                                "2GB",
                                "4GB",
                                "8GB",
                                "12GB",
                                "16GB",
                                "32GB",
                                "64GB",
                                "128GB",
                            ].map((ram) => (
                                <SelectItem key={ram} value={ram}>
                                    {ram}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
