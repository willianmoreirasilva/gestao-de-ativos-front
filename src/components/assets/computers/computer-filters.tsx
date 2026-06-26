"use client";

import { Eye, EyeOff, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";

export function ComputerFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSearch = searchParams.get("search") || "";
    const currentHasIp = searchParams.get("hasIp") || "ALL";

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value && value !== "ALL") {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        params.delete("page"); // Reseta paginação ao filtrar
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200/60 dark:border-zinc-800">
            {/* Busca Geral (Hostname, Usuário, Patrimônio) */}
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                    placeholder="Buscar por hostname, usuário, IP..."
                    defaultValue={currentSearch}
                    onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                    }
                    className="pl-9 bg-white dark:bg-zinc-950"
                />
            </div>

            {/* Filtro por Presença de IP */}
            <div className="relative">
                <select
                    value={currentHasIp}
                    onChange={(e) =>
                        handleFilterChange("hasIp", e.target.value)
                    }
                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white pl-3 pr-10 text-sm focus-visible:outline-none dark:border-zinc-800 dark:bg-zinc-950 appearance-none cursor-pointer"
                >
                    <option value="ALL">Todos os ativos</option>
                    <option value="true">Apenas com IP Atribuído</option>
                    <option value="false">Sem IP Atribuído (Alerta)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-4 w-4 opacity-50"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
