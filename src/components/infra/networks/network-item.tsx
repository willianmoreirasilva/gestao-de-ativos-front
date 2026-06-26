"use client";

import { Edit } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { deleteNetworkAction } from "@/actions/networks";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ConfirmDeleteDialog } from "@/components/users/confirm-delete-dialog";

const NETWORK_TYPES = {
    GENERAL_DATA: "Dados Gerais",
    CAMERA_VLAN: "CFTV / Câmeras",
    SWITCH_MGMT: "Switches",
    WIFI_MGMT: "Wi-Fi",
};

type Props = {
    network: {
        id: string;
        networkAddress: string;
        cidr: number;
        vlanTag: number | null;
        type: "GENERAL_DATA" | "CAMERA_VLAN" | "SWITCH_MGMT" | "WIFI_MGMT";
        totalIps: number;
        _count: { ips: number };
    };
};

export function NetworkItem({ network }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        setActionError(null);

        const result = await deleteNetworkAction(network.id);

        if (result?.error) {
            setActionError(result.error);
        } else {
            setModalOpen(false);
        }
        setIsDeleting(false);
    };

    const handleModalOpenChange = (open: boolean) => {
        setModalOpen(open);
        if (!open) setActionError(null);
    };

    const allocatedCount = network._count?.ips ?? 0;

    // 🧮 CÁLCULO REAL DE IPS USÁVEIS NA SUB-REDE (Fórmula: 2^(32 - CIDR) - 2)
    // Exemplo para /24: 2^(32-24) - 2 = 256 - 2 = 254 IPs utilizáveis.
    // Exemplo para /23: 2^(32-23) - 2 = 512 - 2 = 510 IPs utilizáveis.
    const totalUsableIps = Math.pow(2, 32 - network.cidr) - 2;

    // Subtrai os alocados do total usável da máscara
    const availableCount = Math.max(0, totalUsableIps - allocatedCount);

    const hasAllocatedIps = allocatedCount > 0;
    const isRunningLow = availableCount <= 15 && availableCount > 0;
    const isFullyAllocated = availableCount === 0;

    return (
        <TableRow className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
            <TableCell className="font-medium text-zinc-900 dark:text-zinc-100 py-3">
                {network.networkAddress}/{network.cidr}
            </TableCell>
            <TableCell>
                {network.vlanTag ? (
                    <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        VLAN {network.vlanTag}
                    </span>
                ) : (
                    <span className="text-zinc-400">—</span>
                )}
            </TableCell>
            {/* 3. Tipo de Rede (Oculto no celular, surge no 'sm') */}
            <TableCell className="hidden sm:table-cell text-zinc-600 dark:text-zinc-400">
                {NETWORK_TYPES[network.type] || network.type}
            </TableCell>

            {/* Coluna 4: IPs Alocados (Verde) */}
            {/* 4. IPs Alocados (Oculto no celular e tablet vertical, surge no 'md') */}
            <TableCell className="hidden md:table-cell">
                <span
                    className={
                        hasAllocatedIps
                            ? "text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-md text-xs inline-flex items-center gap-1.5"
                            : "text-zinc-500 text-xs px-2.5 py-1"
                    }
                >
                    {hasAllocatedIps && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                    {allocatedCount} IPs alocados
                </span>
            </TableCell>

            {/* Coluna 5: IPs Disponíveis com Alerta de Esgotamento Preventivo */}
            {/* 5. IPs Disponíveis (Oculto no celular e tablet vertical, surge no 'md') */}
            <TableCell className="hidden md:table-cell">
                {isFullyAllocated ? (
                    <span className="text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-950/30 px-2.5 py-1 rounded-md text-xs inline-flex items-center gap-1.5 border border-red-200 dark:border-red-900/40">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        Esgotada
                    </span>
                ) : isRunningLow ? (
                    <span
                        className="text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-md text-xs inline-flex items-center gap-1.5 border border-amber-200 dark:border-amber-900/40 animate-pulse"
                        title="Atenção: Rede próxima do limite recomendado para expansão"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {availableCount} restantes (Crítico)
                    </span>
                ) : (
                    <span className="text-sky-600 dark:text-sky-400 font-semibold bg-sky-50 dark:bg-sky-950/30 px-2.5 py-1 rounded-md text-xs inline-flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                        {availableCount} livres
                    </span>
                )}
            </TableCell>
            {/* COLUNA 5: Ações */}
            <TableCell className="w-24">
                <div className="flex items-center gap-1">
                    <Link href={`/infra/networks/edit/${network.id}`}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                            title="Editar rede"
                        >
                            <Edit size={16} />
                        </Button>
                    </Link>

                    <ConfirmDeleteDialog
                        name={`${network.networkAddress}/${network.cidr}`}
                        onConfirm={handleDelete}
                        isDeleting={isDeleting}
                        error={actionError}
                        open={modalOpen}
                        setOpen={handleModalOpenChange}
                        disabled={hasAllocatedIps}
                    />
                </div>
            </TableCell>
        </TableRow>
    );
}
