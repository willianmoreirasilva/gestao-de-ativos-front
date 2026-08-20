"use client";

import { Eye, Network, Server } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { deleteSwitchAction } from "@/actions/switches";
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
import { SwitchItem } from "@/types/switches";

interface SwitchRowItemProps {
    switchItem: SwitchItem;
}

export function SwitchRowItem({ switchItem }: SwitchRowItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const identifier =
        switchItem.hostname || switchItem.model || "Switch sem identificação";

    const handleDelete = async () => {
        setIsDeleting(true);
        setActionError(null);

        try {
            const result = await deleteSwitchAction(switchItem.id);

            if (result?.error) {
                setActionError(result.error);
                setIsDeleting(false);
            } else {
                toast.success("Switch removido com sucesso.");
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
                {/* Hostname & Patrimônio */}
                <TableCell className="py-3.5 pl-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40 shrink-0">
                            <Network size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                                {switchItem.hostname || "Sem Hostname"}
                            </span>
                            <span className="text-xs text-zinc-400 font-mono">
                                {switchItem.asset?.patrimony || "S/ PATRIMÔNIO"}
                            </span>
                        </div>
                    </div>
                </TableCell>

                {/* Modelo & Fabricante */}
                <TableCell className="py-3.5 font-medium text-xs text-zinc-700 dark:text-zinc-300">
                    <div className="flex flex-col">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {switchItem.model}
                        </span>
                        {switchItem.vendor && (
                            <span className="text-[10px] text-zinc-400 uppercase font-mono">
                                {switchItem.vendor}
                            </span>
                        )}
                    </div>
                </TableCell>

                {/* IP de Gerenciamento */}
                <TableCell className="py-3.5">
                    {switchItem.asset?.ip?.address ? (
                        <code className="text-xs font-semibold text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 px-2 py-1 rounded">
                            {switchItem.asset.ip.address}
                        </code>
                    ) : (
                        <span className="text-xs text-zinc-400 italic">
                            Sem IP
                        </span>
                    )}
                </TableCell>

                {/* Capacidade de Portas */}
                <TableCell className="py-3.5 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                        <Server size={13} className="text-zinc-400 shrink-0" />
                        <span>{switchItem.totalPorts} portas</span>
                    </div>
                </TableCell>

                {/* Alocação (Departamento & Localização) */}
                <TableCell className="py-3.5 hidden sm:table-cell">
                    <div className="flex flex-col text-xs">
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                            {switchItem.asset?.department?.name ||
                                "Sem Departamento"}
                        </span>
                        <span className="text-[10px] text-zinc-400 mt-0.5">
                            {switchItem.asset?.location?.name
                                ? `${switchItem.asset.location.name}${
                                      switchItem.asset.location.building
                                          ? ` - ${switchItem.asset.location.building}`
                                          : ""
                                  }`
                                : "Sem Localização"}
                        </span>
                    </div>
                </TableCell>

                {/* Ações */}
                <TableCell className="py-3.5 pr-5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                        <NotesPopover notes={switchItem.notes} />

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
                                <Link href={`/switches/${switchItem.id}`}>
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
                                    Visualizar Switch
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TableCell>
            </TableRow>
        </TooltipProvider>
    );
}
