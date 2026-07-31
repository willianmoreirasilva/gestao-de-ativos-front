"use client";

import { Check, ChevronsUpDown, Eraser, Search, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { OptionItem } from "@/types/assets";

interface ComboboxSearchProps {
    options?: OptionItem[];
    value?: string | null;
    onChange: (value: string) => void;
    placeholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    className?: string;
}

/**
 * Remove acentos e caracteres diacríticos para busca insensível a maiúsculas/acentos
 */
const normalizeText = (text: string) =>
    text
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

export function ComboboxSearch({
    options = [],
    value = "",
    onChange,
    placeholder = "Selecione uma opção...",
    emptyMessage = "Nenhum resultado encontrado.",
    disabled = false,
    className,
}: ComboboxSearchProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const listRef = React.useRef<HTMLDivElement>(null);

    // Garantia defensiva contra arrays ou valores nulos/undefined
    const safeOptions = React.useMemo(() => options ?? [], [options]);
    const safeValue = value ?? "";

    const selectedOption = React.useMemo(
        () => safeOptions.find((option) => option.id === safeValue),
        [safeOptions, safeValue],
    );

    const filteredOptions = React.useMemo(() => {
        if (!search.trim()) return safeOptions;
        const normalizedSearch = normalizeText(search);
        return safeOptions.filter((option) =>
            normalizeText(String(option.name || "")).includes(normalizedSearch),
        );
    }, [safeOptions, search]);

    // Trata clique fora do container
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

    // Reseta a busca e gerencia o foco ao abrir/fechar
    React.useEffect(() => {
        if (!isOpen) {
            setSearch("");
            setFocusedIndex(-1);
        } else {
            // Focus imediato sem dependência de setTimeout
            requestAnimationFrame(() => {
                inputRef.current?.focus();
            });
        }
    }, [isOpen]);

    // Reseta o índice focado quando o filtro de busca muda
    React.useEffect(() => {
        setFocusedIndex(-1);
    }, [search]);

    // Scroll automático para manter o item selecionado por teclado visível
    React.useEffect(() => {
        if (focusedIndex >= 0 && listRef.current) {
            const listItems =
                listRef.current.querySelectorAll("[data-option-item]");
            const targetItem = listItems[focusedIndex] as HTMLElement;
            if (targetItem) {
                targetItem.scrollIntoView({ block: "nearest" });
            }
        }
    }, [focusedIndex]);

    // Atalhos de Teclado (Navegação via Setas, Enter e Esc)
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;

        if (!isOpen) {
            if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setFocusedIndex((prev) =>
                    prev < filteredOptions.length - 1 ? prev + 1 : 0,
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setFocusedIndex((prev) =>
                    prev > 0 ? prev - 1 : filteredOptions.length - 1,
                );
                break;
            case "Enter":
                e.preventDefault();
                if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
                    const selected = filteredOptions[focusedIndex];
                    onChange(selected.id === safeValue ? "" : selected.id);
                    setIsOpen(false);
                }
                break;
            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                break;
        }
    };

    return (
        <div
            ref={containerRef}
            onKeyDown={handleKeyDown}
            className={cn("relative w-full", className)}
        >
            {/* Gatilho Principal */}
            <div className="relative flex items-center w-full">
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={cn(
                        "w-full h-9 justify-between text-xs font-normal bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 transition-all text-left pr-12",
                        isOpen &&
                            "border-zinc-400 dark:border-zinc-600 ring-1 ring-zinc-400 dark:ring-zinc-600",
                        !selectedOption && "text-muted-foreground",
                    )}
                >
                    <span className="truncate block w-full">
                        {selectedOption ? selectedOption.name : placeholder}
                    </span>
                </Button>

                {/* Ícones de Controle */}
                <div className="absolute right-2.5 flex items-center gap-1.5 pointer-events-auto">
                    {safeValue && !disabled && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
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

            {/* Painel Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1.5 p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl animate-in fade-in-50 slide-in-from-top-1 duration-150">
                    {/* Campo de Busca */}
                    <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 px-2 pb-2 mb-1">
                        <Search className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                        <Input
                            ref={inputRef}
                            placeholder="Digite para filtrar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoComplete="off"
                            className="h-7 w-full border-0 bg-transparent p-0 text-xs focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 text-zinc-900 dark:text-zinc-100 placeholder:text-muted-foreground"
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

                    {/* Lista de Opções */}
                    <div
                        ref={listRef}
                        className="max-h-48 overflow-y-auto custom-scrollbar space-y-0.5 pr-1"
                    >
                        {/* Botão de desmarcar opção rápida */}
                        {safeValue && !search.trim() && (
                            <button
                                type="button"
                                onClick={() => {
                                    onChange("");
                                    setIsOpen(false);
                                }}
                                className="w-full rounded-md px-2.5 py-1.5 text-xs text-left transition-colors flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-medium border border-transparent border-dashed border-rose-200 dark:border-rose-900/40 mb-1"
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
                            filteredOptions.map((option, index) => {
                                const isSelected = option.id === safeValue;
                                const isKeyboardFocused =
                                    index === focusedIndex;

                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        data-option-item
                                        onClick={() => {
                                            onChange(
                                                isSelected ? "" : option.id,
                                            );
                                            setIsOpen(false);
                                        }}
                                        onMouseEnter={() =>
                                            setFocusedIndex(index)
                                        }
                                        className={cn(
                                            "w-full rounded-md px-2.5 py-1.5 text-xs text-left transition-colors flex items-center justify-between gap-2 border border-transparent",
                                            isSelected
                                                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 font-semibold border-zinc-200 dark:border-zinc-800"
                                                : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/60",
                                            isKeyboardFocused &&
                                                !isSelected &&
                                                "bg-zinc-100/80 dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100",
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
