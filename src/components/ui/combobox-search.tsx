// src/components/ui/combobox-search.tsx
"use client";

import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { OptionItem } from "@/types/assets";

interface ComboboxSearchProps {
    options: OptionItem[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    emptyMessage?: string;
}

const normalizeText = (text: string) =>
    text.toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function ComboboxSearch({
    options,
    value,
    onChange,
    placeholder = "Selecione uma opção...",
    emptyMessage = "Nenhum resultado encontrado.",
}: ComboboxSearchProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const selectedOption = React.useMemo(
        () => options.find((option) => option.id === value),
        [options, value],
    );

    // Filtro instantâneo controlado via React State
    const filteredOptions = React.useMemo(() => {
        if (!search.trim()) return options;
        const normalizedSearch = normalizeText(search);
        return options.filter((option) =>
            normalizeText(String(option.name || "")).includes(normalizedSearch),
        );
    }, [options, search]);

    // Fecha o menu se o usuário clicar fora deste componente
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Reseta a busca sempre que fechar
    React.useEffect(() => {
        if (!isOpen) {
            setSearch("");
        } else {
            // Garante o foco no input interno assim que abrir
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Botão de Gatilho Principal */}
            <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen((prev) => !prev)}
                className={cn(
                    "w-full h-9 justify-between text-xs font-normal bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 transition-all",
                    isOpen &&
                        "border-zinc-400 dark:border-zinc-600 ring-1 ring-zinc-400 dark:ring-zinc-600",
                )}
            >
                <span className="truncate flex-1 text-left">
                    {selectedOption ? selectedOption.name : placeholder}
                </span>
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
            </Button>

            {/* Painel de Busca Expansível (Fica no mesmo plano do DOM, evitando bugs de foco do Dialog) */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1.5 p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl animate-in fade-in-50 slide-in-from-top-1 duration-150">
                    <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 px-2 pb-2 mb-1">
                        <Search className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                        <Input
                            ref={inputRef}
                            placeholder=" Digite para filtrar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoComplete="off"
                            className="h-7 w-full border-0 bg-transparent p-0 text-xs focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 text-zinc-900 dark:text-zinc-100"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded"
                            >
                                <X className="h-3 w-3 text-zinc-400" />
                            </button>
                        )}
                    </div>

                    {/* Lista com scroll nativo destravado */}
                    <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-0.5 pr-1">
                        {filteredOptions.length === 0 ? (
                            <div className="py-3 text-center text-xs text-muted-foreground">
                                {emptyMessage}
                            </div>
                        ) : (
                            filteredOptions.map((option) => {
                                const isSelected = option.id === value;
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => {
                                            onChange(
                                                isSelected ? "" : option.id,
                                            );
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full rounded-md px-2.5 py-1.5 text-xs text-left transition-colors flex items-center justify-between gap-2 border border-transparent",
                                            isSelected
                                                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 font-medium border-zinc-200 dark:border-zinc-800"
                                                : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/60",
                                        )}
                                    >
                                        <span className="truncate">
                                            {option.name}
                                        </span>
                                        {isSelected && (
                                            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
