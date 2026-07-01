"use client";

import { Network } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// 🌟 Importa o seu componente de conectividade real
import { AssetConnectivityCard } from "../../shared/asset-connectivity-card";

interface AssetNetworkFieldsProps {
    form: UseFormReturn<any>;
    assetId: string;
    initialData: any; // Recebe o objeto completo para repassar as informações de IP/VLAN
}

export function AssetNetworkFields({
    form,
    assetId,
    initialData,
}: AssetNetworkFieldsProps) {
    return (
        <div className="space-y-6">
            {/* Bloco A: Especificações de Placa Física */}
            <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3">
                    <div className="p-1.5 bg-zinc-50 dark:bg-zinc-900 rounded-md text-zinc-700 dark:text-zinc-400">
                        <Network size={16} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            Rede Física
                        </h2>
                        <p className="text-[11px] text-zinc-500">
                            Identificadores de hardware da placa
                        </p>
                    </div>
                </div>

                {/* Endereço MAC controlado pelo Form principal */}
                <FormField
                    control={form.control}
                    name="computer.mac"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-semibold">
                                Endereço MAC
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ex: 00:1A:2B:3C:4D:5E"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>

            {/* Bloco B: Integração do seu Componente de Ficha */}
            {/* Passamos os dados extraídos diretamente do initialData vindo da API */}
            <AssetConnectivityCard
                assetId={assetId}
                patrimony={initialData?.patrimony}
                ip={initialData?.ip}
                vlanType={initialData?.vlanType || "GENERAL_DATA"}
            />
        </div>
    );
}
