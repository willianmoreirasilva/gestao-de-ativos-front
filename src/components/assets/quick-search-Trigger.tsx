"use client";

import { Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";

import { QuickSearchModal } from "./quick-search-modal";

export function QuickSearchTrigger() {
    const [open, setOpen] = React.useState(false);

    // Atalho de teclado (Ctrl+K ou Cmd+K) para abrir a busca
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <>
            <Button
                variant="outline"
                onClick={() => setOpen(true)}
                className="relative h-10 w-full md:w-80 justify-start rounded-xl bg-background text-sm text-muted-foreground border-zinc-200 dark:border-zinc-800 shadow-xs hover:bg-accent"
            >
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <span className="inline-flex">Buscar ativos...</span>
                <kbd className="pointer-events-none absolute right-2 top-2.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>

            <QuickSearchModal open={open} onOpenChange={setOpen} />
        </>
    );
}
