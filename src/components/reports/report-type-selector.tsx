"use client";

import {
    Camera,
    Check,
    HardDrive,
    Laptop,
    Phone,
    Printer,
    Wifi,
} from "lucide-react";
import React from "react";

const ASSET_TYPES = [
    { id: "COMPUTER", label: "Computador", icon: Laptop },
    { id: "PRINTER", label: "Impressora", icon: Printer },
    { id: "SWITCH", label: "Switch", icon: HardDrive },
    { id: "ACCESS_POINT", label: "Access Point", icon: Wifi },
    { id: "CAMERA", label: "Câmera", icon: Camera },
    { id: "PHONE", label: "Telefone", icon: Phone },
];

interface ReportTypeSelectorProps {
    selectedTypes: string[];
    onChange: (types: string[]) => void;
}

export function ReportTypeSelector({
    selectedTypes,
    onChange,
}: ReportTypeSelectorProps) {
    const toggleType = (typeId: string) => {
        if (selectedTypes.includes(typeId)) {
            onChange(selectedTypes.filter((t) => t !== typeId));
        } else {
            onChange([...selectedTypes, typeId]);
        }
    };

    return (
        <div className="space-y-2">
            <span className="text-xs text-muted-foreground font-semibold block">
                Tipos de Ativos (Seleção Múltipla):
            </span>
            <div className="flex flex-wrap gap-2">
                {ASSET_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedTypes.includes(type.id);
                    return (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => toggleType(type.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                isSelected
                                    ? "bg-primary/10 text-primary border-primary/30 shadow-xs"
                                    : "bg-background text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground"
                            }`}
                        >
                            <div
                                className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-colors ${
                                    isSelected
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "border-muted-foreground/40 bg-background"
                                }`}
                            >
                                {isSelected && (
                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                )}
                            </div>
                            <Icon className="w-3.5 h-3.5" />
                            {type.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
