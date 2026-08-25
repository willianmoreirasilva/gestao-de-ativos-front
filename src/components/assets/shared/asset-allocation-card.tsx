"use client";

import { Building2, Layers, Layout, MapPin, Pencil, Tag } from "lucide-react";
import { useState } from "react";

import { AllocationEditModal } from "@/components/allocation-edit-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OptionItem } from "@/types/assets";

interface AssetAllocationCardProps {
    assetId: string;
    patrimony?: string | null;
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
                        Alocação e Localização Física
                    </CardTitle>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        onClick={() => setIsEditOpen(true)}
                        title="Editar alocação"
                    >
                        <Pencil size={13} />
                    </Button>
                </CardHeader>

                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
                    {/* 1. Código do Patrimônio */}
                    <div className="p-3 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-lg border border-zinc-100 dark:border-zinc-800/60 flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md shrink-0">
                            <Tag size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                                Patrimônio
                            </span>
                            <span
                                title={patrimony || "Sem Registro"}
                                className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm uppercase tracking-wider block truncate mt-0.5"
                            >
                                {patrimony || "Sem Registro"}
                            </span>
                        </div>
                    </div>

                    {/* 2. Departamento / Setor */}
                    <div className="p-3 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-lg border border-zinc-100 dark:border-zinc-800/60 flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md shrink-0">
                            <Building2 size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                                Departamento / Setor
                            </span>
                            <span
                                title={department?.name || "Não Vinculado"}
                                className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm block truncate mt-0.5"
                            >
                                {department?.name || "Não Vinculado"}
                            </span>
                        </div>
                    </div>

                    {/* 3. Localidade e Endereço Físico */}
                    <div className="p-3 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-lg border border-zinc-100 dark:border-zinc-800/60 flex items-start gap-3">
                        <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md shrink-0 mt-0.5">
                            <MapPin size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                                Localidade Física
                            </span>
                            <span
                                title={location?.name || "Não Alocado"}
                                className="font-bold text-zinc-900 dark:text-zinc-100 text-sm block truncate mt-0.5"
                            >
                                {location?.name || "Não Alocado"}
                            </span>

                            {hasSubLocation && (
                                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                    {location.building && (
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px] font-medium px-1.5 py-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-none"
                                        >
                                            Prédio: {location.building}
                                        </Badge>
                                    )}
                                    {location.floor && (
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px] font-medium px-1.5 py-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-none"
                                        >
                                            {location.floor}º Andar
                                        </Badge>
                                    )}
                                    {location.room && (
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px] font-medium px-1.5 py-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-none"
                                        >
                                            Sala: {location.room}
                                        </Badge>
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
                    currentDepartmentId={department?.id || null}
                    currentLocationId={location?.id || null}
                    departments={options.departments}
                    locations={options.locations}
                />
            </Card>
        </TooltipProvider>
    );
}
