import { X } from "lucide-react";
import React from "react";

export interface FilterChip {
    key: string;
    label: string;
    value: string;
    onRemove: () => void;
}

interface ActiveChipsProps {
    chips: FilterChip[];
    onApply: () => void;
}

export function ActiveChips({ chips, onApply }: ActiveChipsProps) {
    if (chips.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-zinc-400 font-medium">
                Filtros ativos:
            </span>
            {chips.map((chip) => (
                <span
                    key={chip.key}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800 text-zinc-200 border border-zinc-700"
                >
                    <span className="text-zinc-400">{chip.label}:</span>
                    <span>{chip.value}</span>
                    <button
                        type="button"
                        onClick={() => {
                            chip.onRemove();
                            setTimeout(() => onApply(), 50);
                        }}
                        className="hover:text-red-400 text-zinc-400 ml-1"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </span>
            ))}
        </div>
    );
}
