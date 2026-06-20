"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

type Props = {
    placeholder?: string;
    queryParamName?: string;
};

export function SearchInput({ placeholder = "Buscar...", queryParamName = "q" }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    // Pegamos o valor inicial apenas uma vez ao montar o componente
    const initialParamValue = searchParams.get(queryParamName) || "";
    const [text, setText] = useState(initialParamValue);

    // 🌟 CORREÇÃO DO LOOP: Monitoramos APENAS a variável 'text'
    useEffect(() => {
        // Se o texto na caixinha for igual ao que já está na URL, não faz nada (evita disparos extras)
        const currentParam = searchParams.get(queryParamName) || "";
        if (text === currentParam) return;

        const delayDebounce = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (text) {
                params.set(queryParamName, text);
                params.set("page", "1");
            } else {
                params.delete(queryParamName);
            }
            // Faz o push de forma silenciosa e limpa
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }, 400);

        return () => clearTimeout(delayDebounce);
        
        // 🌟 ATENÇÃO: Deixamos apenas o 'text' aqui. Adicionar router, pathname ou searchParams 
        // causa instabilidade e loops infinitos em várias versões do Next.js 13/14/15.
    }, [text]);

    const handleClear = () => {
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
                onChange={(e) => setText(e.target.value)}
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