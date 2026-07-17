"use client";

import { ClipboardList, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface NotesPopoverProps {
    notes?: string | null;
}

export function NotesPopover({ notes }: NotesPopoverProps) {
    const hasNotes = !!notes && notes.trim().length > 0;

    return (
        <TooltipProvider delayDuration={200}>
            <Popover>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors relative"
                            >
                                <ClipboardList size={14} />
                                {hasNotes && (
                                    <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-zinc-950 animate-pulse" />
                                )}
                            </Button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        <p className="text-[10px] font-semibold">
                            {hasNotes ? "Ver Observações" : "Sem Notas"}
                        </p>
                    </TooltipContent>
                </Tooltip>

                <PopoverContent className="w-80 p-4 border-zinc-200 dark:border-zinc-800 shadow-lg rounded-xl">
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-900 pb-1.5">
                            <FileText size={14} className="text-zinc-500" />
                            <h4 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                                Notas Técnicas / Observações
                            </h4>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-h-[160px] overflow-y-auto whitespace-pre-wrap">
                            {hasNotes
                                ? notes
                                : "Nenhuma nota técnica foi registrada para este computador."}
                        </p>
                    </div>
                </PopoverContent>
            </Popover>
        </TooltipProvider>
    );
}
