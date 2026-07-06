"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ComboboxSearchOption {
    id: string;
    name: string;
}

interface ComboboxSearchProps {
    options: ComboboxSearchOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    emptyMessage?: string;
}

const normalizeText = (text: string) =>
    text
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");

export function ComboboxSearch({
    options,
    value,
    onChange,
    placeholder = "Selecione uma opção...",
    emptyMessage = "Nenhum resultado encontrado.",
}: ComboboxSearchProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const selectedOption = React.useMemo(
        () => options.find((option) => option.id === value),
        [options, value],
    );

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setSearch("");
        }
        setOpen(nextOpen);
    };

    const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (open) return;

        const isPrintableKey = event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey;
        if (isPrintableKey) {
            setSearch(event.key);
            setOpen(true);
            event.preventDefault();
        }
    };

    React.useEffect(() => {
        if (open) {
            inputRef.current?.focus();
        }
    }, [open]);

    const filteredOptions = React.useMemo(() => {
        if (!search) return options;
        const normalizedSearch = normalizeText(search);
        return options.filter((option) =>
            normalizeText(String(option.name || option.id)).includes(normalizedSearch)
        );
    }, [options, search]);

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    onKeyDown={handleTriggerKeyDown}
                    className="w-full h-9 justify-between text-xs font-normal bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800"
                >
                    <span className="truncate flex-1 text-left">
                        {selectedOption ? selectedOption.name : placeholder}
                    </span>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-full max-w-[320px] p-3 pointer-events-auto"
                align="start"
            >
                <div className="space-y-2 w-full min-w-0">
                    <Input
                        ref={inputRef}
                        placeholder="Digite para filtrar..."
                        value={search}
                        onFocus={() => setOpen(true)}
                        onChange={(event) => setSearch(event.target.value)}
                        autoComplete="off"
                        className="h-9 text-xs w-full"
                    />
                    <div className="max-h-[220px] overflow-y-auto custom-scrollbar space-y-1" onWheel={(event) => event.stopPropagation()}>
                        {filteredOptions.length === 0 ? (
                            <div className="py-3 text-center text-xs text-muted-foreground">
                                {emptyMessage}
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.id === value ? "" : option.id);
                                        setSearch("");
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        "w-full rounded-md px-3 py-2 text-xs text-left transition-colors",
                                        value === option.id
                                            ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
                                            : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="truncate">{option.name}</span>
                                        <Check
                                            className={cn(
                                                "h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400",
                                                value === option.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
