"use client";

import { Cpu, Eye, HardDrive, Layers, ShieldAlert } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { AssetItem } from "@/types/assets";

type Props = {
    asset: AssetItem;
};

export function ComputerRowItem({ asset }: Props) {
    const hasHardwareInfo =
        asset.computer?.processor?.name ||
        asset.computer?.memory ||
        asset.computer?.disk?.name;
    const osName = asset.computer?.operatingSystem?.name || "";

    // Helper visual para determinar a cor do selo do SO de forma elegante
    const getOsBadgeStyles = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes("win"))
            return "bg-blue-50/60 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30";
        if (lower.includes("lin") || lower.includes("ubu"))
            return "bg-orange-50/60 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30";
        if (lower.includes("mac"))
            return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/30";
        return "bg-zinc-50 text-zinc-600 dark:bg-zinc-900/40 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800/50";
    };

    return (
        <TableRow className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/40 transition-colors border-b border-zinc-100 dark:border-zinc-900 group">
            {/* 1. Hostname e Código de Patrimônio */}
            <TableCell className="py-3.5 pl-5 font-semibold text-zinc-900 dark:text-zinc-100">
                <div className="flex flex-col gap-0.5">
                    <span className="tracking-tight group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                        {asset.computer?.hostname || "Sem Hostname"}
                    </span>
                    {asset.patrimony && (
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono tracking-wider font-normal">
                            PAT: {asset.patrimony}
                        </span>
                    )}
                </div>
            </TableCell>

            {/* 2. Endereço IPv4 */}
            <TableCell className="py-3.5">
                {asset.ip?.address ? (
                    <Badge
                        variant="secondary"
                        className="font-bold bg-emerald-50/60 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/20 px-2.5 py-0.5 rounded-md text-xs shadow-none"
                    >
                        {asset.ip.address}
                    </Badge>
                ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-900/30">
                        <ShieldAlert size={12} /> Sem IP
                    </span>
                )}
            </TableCell>

            {/* 3. Usuário Responsável / Utilizador */}
            <TableCell className="py-3.5 text-zinc-600 dark:text-zinc-400 text-sm font-medium">
                {asset.computer?.username || "—"}
            </TableCell>

            {/* 4. Módulo de Hardware Padronizado (UI/UX Limpa) */}
            <TableCell className="hidden md:table-cell py-3.5 max-w-xs">
                {hasHardwareInfo ? (
                    <div className="space-y-1.5 max-w-[280px]">
                        {/* Linha 1: Processador e Memória */}
                        <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                            <span className="inline-flex items-center gap-1 font-medium truncate max-w-[180px]">
                                <Cpu
                                    size={12}
                                    className="text-zinc-400 shrink-0"
                                />
                                {asset.computer?.processor?.name ||
                                    "CPU Desconhecida"}
                            </span>
                            {asset.computer?.memory && (
                                <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-1.5 py-px rounded text-[10px] font-bold uppercase shrink-0">
                                    {asset.computer.memory}
                                </span>
                            )}
                        </div>
                        {/* Linha 2: Disco e Sistema Operacional */}
                        <div className="flex items-center gap-2">
                            {asset.computer?.disk?.name && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500 font-normal truncate max-w-[120px]">
                                    <HardDrive size={11} className="shrink-0" />
                                    {asset.computer.disk.name}
                                </span>
                            )}
                            {osName && (
                                <span
                                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-px rounded tracking-tight shrink-0 ${getOsBadgeStyles(osName)}`}
                                >
                                    <Layers size={10} className="opacity-70" />
                                    {osName}
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <span className="text-xs text-zinc-400">—</span>
                )}
            </TableCell>

            {/* 5. Alocação (Localidade & Setor) */}
            <TableCell className="hidden sm:table-cell py-3.5 text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-300 tracking-tight">
                        {asset.location?.name || "Não Alocado"}
                    </span>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                        {asset.department?.name || "Sem Departamento"}
                    </span>
                </div>
            </TableCell>

            {/* 6. Ação: Visualização da Ficha Completa */}
            <TableCell className="py-3.5 w-20 text-center pr-5">
                <Link href={`/assets/computers/${asset.id}`}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                        title="Visualizar ficha técnica completa"
                    >
                        <Eye size={15} />
                    </Button>
                </Link>
            </TableCell>
        </TableRow>
    );
}
