"use client";

import { Eye, Link2, PhoneCall } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

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
import { deleteAssetAction } from "@/services/assets";
import { AssetItem } from "@/types/assets";

interface PhoneRowItemProps {
    asset: AssetItem;
}

export function PhoneRowItem({ asset }: PhoneRowItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const phoneNumber = asset.phone?.phoneNumber || "Sem Ramal";
    const hostname = asset.phone?.hostname || "S/ HOSTNAME";
    const model = asset.phone?.model || "Modelo Genérico / VoIP";
    const patrimony = asset.patrimony || "S/ PATRIMÔNIO";

    const identifier = `${hostname} (${phoneNumber})`;

    const handleDelete = async () => {
        setIsDeleting(true);
        setActionError(null);

        try {
            const result = await deleteAssetAction(asset.id);

            if (result?.error) {
                setActionError(result.error);
                setIsDeleting(false);
            } else {
                toast.success("Telefone/Ramal removido com sucesso.");
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
                {/* 🟢 1. Hostname / Ramal (Destaque Principal) */}
                <TableCell className="py-3.5 pl-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 shrink-0">
                            <PhoneCall size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-xs tracking-wide uppercase">
                                {hostname}
                            </span>
                            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono font-medium">
                                Ramal: {phoneNumber}
                            </span>
                        </div>
                    </div>
                </TableCell>

                {/* 🟢 2. Modelo / Patrimônio */}
                <TableCell className="py-3.5">
                    <div className="flex flex-col">
                        <span className="font-semibold text-xs text-zinc-800 dark:text-zinc-200">
                            {model}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono uppercase">
                            {patrimony}
                        </span>
                    </div>
                </TableCell>

                {/* 3. Endereço IP */}
                <TableCell className="py-3.5">
                    {asset.ip?.address ? (
                        <code className="text-xs font-semibold text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 px-2 py-1 rounded">
                            {asset.ip.address}
                        </code>
                    ) : (
                        <span className="text-xs text-zinc-400 italic">
                            Sem IP
                        </span>
                    )}
                </TableCell>

                {/* 4. Conexão Switch */}
                <TableCell className="py-3.5 hidden sm:table-cell">
                    {asset.connectedToSwitch ? (
                        <div className="flex flex-col text-xs">
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                                <Link2
                                    size={12}
                                    className="text-blue-500 shrink-0"
                                />
                                {asset.connectedToSwitch.model || "Switch"}
                            </span>
                            <span className="text-zinc-400 text-[10px] uppercase font-mono mt-0.5">
                                Porta {asset.switchPort || "N/A"}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xs text-zinc-400 italic">
                            Não Informado
                        </span>
                    )}
                </TableCell>

                {/* 5. Alocação Operacional */}
                <TableCell className="py-3.5 hidden sm:table-cell">
                    <div className="flex flex-col text-xs">
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                            {asset.department?.name || "Não Vinculado"}
                        </span>
                        <span className="text-[10px] text-zinc-400 mt-0.5">
                            {asset.location?.name || "Sem Localização"}
                        </span>
                    </div>
                </TableCell>

                {/* 6. Ações */}
                <TableCell className="py-3.5 pr-5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                        <NotesPopover notes={asset.phone?.notes} />

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
                                <Link href={`/assets/phones/${asset.id}`}>
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
                                    Visualizar Telefone
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TableCell>
            </TableRow>
        </TooltipProvider>
    );
}
