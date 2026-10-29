"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";

type Props = {
    placeholder?: string;
    queryParamName?: string;
};

export function SearchInput({
    placeholder = "Buscar...",
    queryParamName = "q",
}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Pegamos o valor inicial apenas uma vez ao montar o componente
    const initialParamValue = searchParams.get(queryParamName) || "";
    const [text, setText] = useState(initialParamValue);

    // Debounce no próprio onChange: sem useEffect, sem depender de router/searchParams
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Cancela a busca pendente ao desmontar
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    const handleChange = (value: string) => {
        setText(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);

        // Se o texto já é o que está na URL, não faz nada (evita disparos extras)
        const currentParam = searchParams.get(queryParamName) || "";
        if (value === currentParam) return;

        debounceRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(queryParamName, value);
                params.set("page", "1");
            } else {
                params.delete(queryParamName);
            }
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }, 400);
    };

    const handleClear = () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setText("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete(queryParamName);
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="relative max-w-sm w-full mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />

            <Input
                type="text"
                placeholder={placeholder}
                value={text}
                onChange={(e) => handleChange(e.target.value)}
                className="pl-9 pr-9"
            />

            {text && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-2.5 top-2.5 h-4 w-4 text-zinc-400 hover:text-zinc-600 transition-colors rounded-full p-0.5 hover:bg-zinc-100 flex items-center justify-center"
                    title="Limpar busca"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}
