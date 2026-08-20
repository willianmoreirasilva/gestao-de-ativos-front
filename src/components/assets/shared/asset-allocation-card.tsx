"use client";

import { Building2, Layout, MapPin, Pencil, Tag, User } from "lucide-react";
import { useState } from "react";

import { AllocationEditModal } from "@/components/allocation-edit-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OptionItem } from "@/types/assets";

interface AssetAllocationCardProps {
    assetId: string;
    patrimony?: string | null;
    username?: string | null;
    department?: { id: string; name: string } | null;
    location?: {
        id: string;
        name: string;
        building?: string | null;
        floor?: string | null;
        room?: string | null;
    } | null;
    options: {
        departments: OptionItem[];
        locations: OptionItem[];
    };
}

export function AssetAllocationCard({
    assetId,
    patrimony,
    username,
    department,
    location,
    options,
}: AssetAllocationCardProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const hasSubLocation =
        location?.building || location?.floor || location?.room;

    return (
        <TooltipProvider delayDuration={200}>
            <Card className="md:col-span-3 shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 py-2.5 px-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xs font-bold tracking-wide uppercase text-zinc-500 flex items-center gap-2">
                        <Layout size={15} className="text-purple-500" />{" "}
                        Alocação de Infraestrutura e Responsabilidade
                    </CardTitle>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        onClick={() => setIsEditOpen(true)}
                        title="Editar alocações"
                    >
                        <Pencil size={13} />
                    </Button>
                </CardHeader>

                {/* 🚀 Grid ajustado para 4 Colunas no Desktop */}
                <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
                    {/* 1. Patrimônio Corporativo */}
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg shrink-0">
                            <Tag
                                size={16}
                                className="text-purple-500 dark:text-purple-400"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="text-[11px] text-muted-foreground block truncate">
                                Patrimônio
                            </span>
                            <span
                                title={patrimony || "Sem Registro"}
                                className="font-mono font-bold text-zinc-900 dark:text-zinc-100 block mt-0.5 text-sm uppercase tracking-wider truncate"
                            >
                                {patrimony || "Sem Registro"}
                            </span>
                        </div>
                    </div>

                    {/* 2. Usuário Responsável */}
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg shrink-0">
                            <User size={16} className="text-zinc-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="text-[11px] text-muted-foreground block truncate">
                                Usuário Responsável
                            </span>
                            <span
                                title={username || "Utilizador Padrão"}
                                className="font-semibold text-zinc-900 dark:text-zinc-100 block mt-0.5 text-sm truncate"
                            >
                                {username || "Utilizador Padrão"}
                            </span>
                        </div>
                    </div>

                    {/* 3. Departamento / Setor */}
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg shrink-0">
                            <Building2 size={16} className="text-zinc-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="text-[11px] text-muted-foreground block truncate">
                                Departamento / Setor
                            </span>
                            <span
                                title={department?.name || "Não Vinculado"}
                                className="font-semibold text-zinc-900 dark:text-zinc-100 block mt-0.5 text-sm truncate"
                            >
                                {department?.name || "Não Vinculado"}
                            </span>
                        </div>
                    </div>

                    {/* 4. Localidade Principal */}
                    <div className="flex items-center gap-2.5 min-w-0 border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-900 pt-3 md:pt-0 md:pl-4">
                        <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg shrink-0">
                            <MapPin size={16} className="text-zinc-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="text-[11px] text-muted-foreground block truncate">
                                Localidade Principal
                            </span>
                            <span
                                title={location?.name || "Não Alocado"}
                                className="font-bold text-zinc-900 dark:text-zinc-100 text-sm block truncate"
                            >
                                {location?.name || "Não Alocado"}
                            </span>

                            {hasSubLocation && (
                                <div className="flex items-center gap-1 mt-1 text-[9px] text-zinc-500 truncate">
                                    {location.building && (
                                        <span
                                            className="bg-zinc-100 dark:bg-zinc-900 px-1 py-0.5 rounded truncate"
                                            title={`Prédio: ${location.building}`}
                                        >
                                            P: {location.building}
                                        </span>
                                    )}
                                    {location.floor && (
                                        <span className="bg-zinc-100 dark:bg-zinc-900 px-1 py-0.5 rounded truncate">
                                            {location.floor}º A.
                                        </span>
                                    )}
                                    {location.room && (
                                        <span
                                            className="bg-zinc-100 dark:bg-zinc-900 px-1 py-0.5 rounded truncate"
                                            title={`Sala: ${location.room}`}
                                        >
                                            Sl: {location.room}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>

                <AllocationEditModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    assetId={assetId}
                    patrimony={patrimony}
                    username={username}
                    currentDepartmentId={department?.id || null}
                    currentLocationId={location?.id || null}
                    departments={options.departments}
                    locations={options.locations}
                />
            </Card>
        </TooltipProvider>
    );
}
