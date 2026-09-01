"use client";

import { Eye, Wifi } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { deleteAccessPointAction } from "@/actions/access-points";
import { NotesPopover } from "@/components/assets/shared/notes-popover";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConfirmDeleteDialog } from "@/components/users/confirm-delete-dialog";
import { getApVlanType } from "@/lib/utils";
import { AccessPointItem } from "@/types/access-points";

interface AccessPointRowItemProps {
    apItem: AccessPointItem;
}

export function AccessPointRowItem({ apItem }: AccessPointRowItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const identifier =
        apItem.name || apItem.model || "Access Point sem identificação";
    const vlanType = getApVlanType(apItem.vendor);
    const isRuckus = vlanType === "WIFI_MGMT";

    const handleDelete = async () => {
        setIsDeleting(true);
        setActionError(null);

        try {
            const result = await deleteAccessPointAction(apItem.id);

            if (result?.error) {
                setActionError(result.error);
                setIsDeleting(false);
            } else {
                toast.success("Access Point removido com sucesso.");
                setModalOpen(false);
                setIsDeleting(false);
            }
        } catch {
            setActionError("Falha de comunicação com o servidor.");
            setIsDeleting(false);
        }
    };

    return (
        <TooltipProvider delayDuration={200}>
            <TableRow className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                {/* AP / Nome & Patrimônio */}
                <TableCell className="py-3.5 pl-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/40 shrink-0">
                            <Wifi size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                                {apItem.name || "Sem Nome"}
                            </span>
                            <span className="text-xs text-zinc-400 font-mono">
                                {apItem.asset?.patrimony || "S/ PATRIMÔNIO"}
                            </span>
                        </div>
                    </div>
                </TableCell>

                {/* Modelo & Fabricante */}
                <TableCell className="py-3.5 font-medium text-xs text-zinc-700 dark:text-zinc-300">
                    <div className="flex flex-col">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {apItem.model}
                        </span>
                        {apItem.vendor && (
                            <span className="text-[10px] text-zinc-400 uppercase font-mono">
                                {apItem.vendor}
                            </span>
                        )}
                    </div>
                </TableCell>

                {/* SSID & Escopo de Rede */}
                <TableCell className="py-3.5 hidden sm:table-cell">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-[150px]">
                            {apItem.ssid || "SSID não configurado"}
                        </span>
                        <div className="flex items-center">
                            <span
                                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                    isRuckus
                                        ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40"
                                        : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40"
                                }`}
                            >
                                {vlanType}
                            </span>
                        </div>
                    </div>
                </TableCell>

                {/* IP de Gerência */}
                <TableCell className="py-3.5">
                    {apItem.asset?.ip?.address ? (
                        <code className="text-xs font-semibold text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 px-2 py-1 rounded">
                            {apItem.asset.ip.address}
                        </code>
                    ) : (
                        <span className="text-xs text-zinc-400 italic">
                            Sem IP
                        </span>
                    )}
                </TableCell>

                {/* Setor & Localização */}
                <TableCell className="py-3.5 hidden sm:table-cell">
                    <div className="flex flex-col text-xs">
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                            {apItem.asset?.department?.name ||
                                "Sem Departamento"}
                        </span>
                        <span className="text-[10px] text-zinc-400 mt-0.5">
                            {apItem.asset?.location?.name
                                ? `${apItem.asset.location.name}${
                                      apItem.asset.location.building
                                          ? ` - ${apItem.asset.location.building}`
                                          : ""
                                  }`
                                : "Sem Localização"}
                        </span>
                    </div>
                </TableCell>

                {/* Ações */}
                <TableCell className="py-3.5 pr-5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                        <NotesPopover notes={apItem.notes} />

                        <ConfirmDeleteDialog
                            name={identifier}
                            onConfirm={handleDelete}
                            isDeleting={isDeleting}
                            error={actionError}
                            open={modalOpen}
                            setOpen={setModalOpen}
                        />

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href={`/assets/access-points/${apItem.id}`}
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/40 border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 rounded-lg transition-all"
                                    >
                                        <Eye size={14} />
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p className="text-[10px] font-semibold">
                                    Visualizar AP
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TableCell>
            </TableRow>
        </TooltipProvider>
    );
}
