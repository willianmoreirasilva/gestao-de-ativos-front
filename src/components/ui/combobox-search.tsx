"use client";

import { Check, ChevronsUpDown, Eraser, Search, X } from "lucide-react";
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

    const filteredOptions = React.useMemo(() => {
        if (!search.trim()) return options;
        const normalizedSearch = normalizeText(search);
        return options.filter((option) =>
            normalizeText(String(option.name || "")).includes(normalizedSearch),
        );
    }, [options, search]);

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

    React.useEffect(() => {
        if (!isOpen) {
            setSearch("");
        } else {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Botão de Gatilho Principal */}
            <div className="relative flex items-center w-full">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={cn(
                        "w-full h-9 justify-between text-xs font-normal bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 transition-all text-left pr-8",
                        isOpen &&
                            "border-zinc-400 dark:border-zinc-600 ring-1 ring-zinc-400 dark:ring-zinc-600",
                    )}
                >
                    <span className="truncate text-left block w-full">
                        {selectedOption ? selectedOption.name : placeholder}
                    </span>
                </Button>

                {/* Ícones de controle empilhados à direita */}
                <div className="absolute right-2.5 flex items-center gap-1.5 pointer-events-auto">
                    {/* 🌟 Botão rápido de Clear (X) se houver valor selecionado */}
                    {value && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation(); // Evita abrir o dropdown ao clicar no X
                                onChange("");
                            }}
                            className="p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                            title="Limpar seleção"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                    <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-40 text-zinc-500" />
                </div>
            </div>

            {/* Painel de Busca Expansível */}
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
                        {/* 🌟 Botão fixo no topo da lista para limpar de forma explícita */}
                        {value && !search.trim() && (
                            <button
                                type="button"
                                onClick={() => {
                                    onChange("");
                                    setIsOpen(false);
                                }}
                                className="w-full rounded-md px-2.5 py-1.5 text-xs text-left transition-colors flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-medium border border-transparent border-dashed border-red-200 dark:border-red-900/40 mb-1"
                            >
                                <Eraser className="h-3.5 w-3.5 shrink-0" />
                                <span>Remover / Limpar campo</span>
                            </button>
                        )}

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
