"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";

export function NetworkFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Lê os valores atuais da URL para manter o formulário sincronizado
    const currentSearch = searchParams.get("search") || "";
    const currentVlan = searchParams.get("vlanTag") || "";
    const currentType = searchParams.get("type") || "ALL";

    // Atualiza a URL mantendo ou removendo parâmetros dinamicamente
    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value && value !== "ALL") {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        // 🌟 CORREÇÃO CRUCIAL: Sempre remove a paginação ao mudar os filtros!
        // Isso evita que um offset/page alto quebre a paginação de uma listagem filtrada menor.
        params.delete("page");

        // Atualiza a rota preservando o pathname atual de forma limpa
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200/60 dark:border-zinc-800">
            {/* Filtro 1: Endereço de Rede (Busca por Texto) */}
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                    placeholder="Buscar IP (ex: 192.168.1.0)..."
                    defaultValue={currentSearch}
                    onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                    }
                    className="pl-9 bg-white dark:bg-zinc-950"
                />
            </div>

            {/* Filtro 2: Tag VLAN (Busca por Texto/Número) */}
            <div>
                <Input
                    type="number"
                    placeholder="Filtrar por VLAN..."
                    defaultValue={currentVlan}
                    onChange={(e) =>
                        handleFilterChange("vlanTag", e.target.value)
                    }
                    className="bg-white dark:bg-zinc-950"
                />
            </div>

            {/* Filtro 3: Tipo de Rede (Select) */}
            <div className="relative">
                <select
                    value={currentType}
                    onChange={(e) => handleFilterChange("type", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white pl-3 pr-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-zinc-300 appearance-none cursor-pointer"
                >
                    <option value="ALL">Todos os Tipos</option>
                    <option value="GENERAL_DATA">Dados Gerais</option>
                    <option value="CAMERA_VLAN">CFTV / Câmeras</option>
                    <option value="SWITCH_MGMT">Switches</option>
                    <option value="WIFI_MGMT">Wi-Fi</option>
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 dark:text-zinc-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 opacity-50"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
