"use client";

import { Globe, Monitor, Search, ShieldAlert } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <div className="flex flex-col sm:flex-row gap-3 w-full bg-zinc-50 dark:bg-zinc-900/50 p-3 sm:p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 items-stretch sm:items-center">
            {/* Campo de Busca Geral */}
            <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                <Input
                    placeholder="Buscar por hostname, usuário, IP..."
                    defaultValue={currentSearch}
                    onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                    }
                    className="pl-9 bg-white dark:bg-zinc-950 h-10 border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm rounded-lg w-full"
                />
            </div>

            {/* Controle de Tabs Otimizado */}
            <div className="w-full sm:w-auto">
                <Tabs
                    value={currentHasIp}
                    onValueChange={(val) => handleFilterChange("hasIp", val)}
                    className="w-full"
                >
                    {/* 'w-full' garante que em telas pequenas as tabs preencham horizontalmente todo o espaço disponível */}
                    <TabsList className="grid grid-cols-3 h-10 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 p-1 rounded-lg w-full sm:w-[320px]">
                        {/* Opção: Todos */}
                        <TabsTrigger
                            value="ALL"
                            className="text-xs font-semibold gap-1.5 px-2 sm:px-3 py-1.5 rounded-md transition-all justify-center"
                        >
                            <Monitor
                                size={14}
                                className="shrink-0 opacity-70"
                            />
                            {/* Oculta o texto em celulares ultra pequenos (abaixo de 380px) para não quebrar o layout */}
                            <span className="hidden xs:inline">Todos</span>
                        </TabsTrigger>

                        {/* Opção: Com IP */}
                        <TabsTrigger
                            value="true"
                            className="text-xs font-semibold gap-1.5 px-2 sm:px-3 py-1.5 rounded-md transition-all justify-center data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400"
                        >
                            <Globe size={14} className="shrink-0 opacity-70" />
                            <span className="hidden xs:inline">Com IP</span>
                            <span className="xs:hidden">Com IP</span>
                        </TabsTrigger>

                        {/* Opção: Sem IP */}
                        <TabsTrigger
                            value="false"
                            className="text-xs font-semibold gap-1.5 px-2 sm:px-3 py-1.5 rounded-md transition-all justify-center data-[state=active]:text-amber-600 dark:data-[state=active]:text-amber-500"
                        >
                            <ShieldAlert
                                size={14}
                                className="shrink-0 opacity-70"
                            />
                            <span className="hidden xs:inline">Sem IP</span>
                            <span className="xs:hidden">Sem IP</span>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>
    );
}
