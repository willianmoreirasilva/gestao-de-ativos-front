"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export function SearchInput() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [text, setText] = useState(searchParams.get("q") || "");

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (text) {
                params.set("q", text);
                params.set("page", "1"); // Reseta para a página 1 ao buscar
            } else {
                params.delete("q");
            }
            router.push(`${pathname}?${params.toString()}`);
        }, 400); // Aguarda 400ms após o usuário parar de digitar

        return () => clearTimeout(delayDebounce);
    }, [text]);

    return (
        <div className="relative max-w-sm w-full mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
                type="text"
                placeholder="Buscar por nome..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="pl-9"
            />
        </div>
    );
}
