"use client";

import { FileText } from "lucide-react";

interface AssetNotesCardProps {
    notes?: string | null;
}

export function AssetNotesCard({ notes }: AssetNotesCardProps) {
    if (!notes || !notes.trim()) {
        return null;
    }

    return (
        /* Adicionamos 'col-span-full' e uma margem superior 'mt-2' para separá-lo visualmente do grid acima */
        <div className="col-span-full mt-2 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
            <div className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
                <FileText
                    className="text-zinc-500 dark:text-zinc-400"
                    size={16}
                />
                <span className="text-xs font-bold uppercase tracking-wider">
                    Notas e Observações
                </span>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed font-normal">
                {notes}
            </p>
        </div>
    );
}
