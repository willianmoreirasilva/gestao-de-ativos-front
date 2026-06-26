"use client";

import { Eye, ShieldAlert } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { AssetItem } from "@/types/assets";

type Props = {
    asset: AssetItem;
};

export function ComputerRowItem({ asset }: Props) {
    return (
        <TableRow className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
            {/* Hostname e Patrimônio */}
            <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100 py-3">
                <div className="flex flex-col gap-0.5">
                    <span>{asset.computer?.hostname || "Sem Hostname"}</span>
                    {asset.patrimony && (
                        <span className="text-[10px] text-muted-foreground font-mono">
                            Pat: {asset.patrimony}
                        </span>
                    )}
                </div>
            </TableCell>

            {/* Endereço IP */}
            <TableCell>
                {asset.ip?.address ? (
                    <Badge
                        variant="secondary"
                        className="font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-none"
                    >
                        {asset.ip.address}
                    </Badge>
                ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/30">
                        <ShieldAlert size={12} /> Sem IP
                    </span>
                )}
            </TableCell>

            {/* Usuário Principal */}
            <TableCell className="text-zinc-600 dark:text-zinc-400">
                {asset.computer?.username || "—"}
            </TableCell>

            {/* Hardware Resumido (Escondido em Mobile) */}
            <TableCell className="hidden md:table-cell text-zinc-500 max-w-45 truncate">
                {asset.computer?.processor
                    ? `${asset.computer.processor} (${asset.computer.memory || "N/A"})`
                    : "—"}
            </TableCell>

            {/* Local e Setor (Escondido em Mobile) */}
            <TableCell className="hidden sm:table-cell text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex flex-col">
                    <span className="font-medium text-zinc-800 dark:text-zinc-300">
                        {asset.location?.name || "Não alocado"}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                        {asset.department?.name || "Sem setor"}
                    </span>
                </div>
            </TableCell>

            {/* Ação: Ver Detalhes Completos */}
            <TableCell className="w-16 text-center">
                <Link href={`/assets/computers/${asset.id}`}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                        title="Visualizar ficha técnica completa"
                    >
                        <Eye size={16} />
                    </Button>
                </Link>
            </TableCell>
        </TableRow>
    );
}
