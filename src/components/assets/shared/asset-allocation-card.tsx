"use client";

import { Building2, Layout, MapPin, Pencil, Tag, User } from "lucide-react";
import { useState } from "react";

// 🚀 Caminho atualizado para a pasta compartilhada
import { AllocationEditModal } from "@/components/allocation-edit-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <Card className="md:col-span-3 shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 py-3 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-bold tracking-wide uppercase text-zinc-500 flex items-center gap-2">
                    <Layout size={16} className="text-purple-500" /> Alocação de
                    Infraestrutura e Responsabilidade
                </CardTitle>
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                    onClick={() => setIsEditOpen(true)}
                    title="Editar alocações"
                >
                    <Pencil size={14} />
                </Button>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Patrimônio Corporativo */}
                <div className="space-y-1 flex items-start gap-2.5">
                    <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg mt-1">
                        <Tag
                            size={16}
                            className="text-purple-500 dark:text-purple-400"
                        />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground block">
                            Patrimônio
                        </span>
                        <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 block mt-0.5 text-base uppercase tracking-wider">
                            {patrimony || "Sem Registro"}
                        </span>
                    </div>
                </div>

                <div className="space-y-1 flex items-start gap-2.5">
                    <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg mt-1">
                        <User size={16} className="text-zinc-500" />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground block">
                            Usuário Responsável
                        </span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mt-0.5">
                            {username || "Utilizador Padrão"}
                        </span>
                    </div>
                </div>

                <div className="space-y-1 flex items-start gap-2.5">
                    <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg mt-1">
                        <Building2 size={16} className="text-zinc-500" />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground block">
                            Departamento / Setor
                        </span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mt-0.5 text-base">
                            {department?.name || "Não Vinculado"}
                        </span>
                    </div>
                </div>

                <div className="space-y-1 flex items-start gap-2.5 border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-900 pt-4 md:pt-0 md:pl-6">
                    <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg mt-1">
                        <MapPin size={16} className="text-zinc-500" />
                    </div>
                    <div className="space-y-2 flex-1">
                        <div>
                            <span className="text-xs text-muted-foreground block">
                                Localidade Principal
                            </span>
                            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-base block">
                                {location?.name || "Não Alocado"}
                            </span>
                        </div>

                        {hasSubLocation && (
                            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800">
                                {location.building && (
                                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-1.5 rounded text-center">
                                        <span className="text-[10px] text-muted-foreground block uppercase font-medium">
                                            Prédio
                                        </span>
                                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                            {location.building}
                                        </span>
                                    </div>
                                )}
                                {location.floor && (
                                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-1.5 rounded text-center">
                                        <span className="text-[10px] text-muted-foreground block uppercase font-medium">
                                            Andar
                                        </span>
                                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                            {location.floor}º
                                        </span>
                                    </div>
                                )}
                                {location.room && (
                                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-1.5 rounded text-center">
                                        <span className="text-[10px] text-muted-foreground block uppercase font-medium">
                                            Sala
                                        </span>
                                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                            {location.room}
                                        </span>
                                    </div>
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
    );
}
