"use client";

import { Eye, HardDrive, Link2, Monitor, Trash2 } from "lucide-react";
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

interface ComputerRowItemProps {
    asset: AssetItem;
}

export function ComputerRowItem({ asset }: ComputerRowItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const diskInfo = asset.computer?.disk
        ? `${asset.computer.disk.name} ${(asset.computer.disk as any).size || ""}`.trim()
        : "Sem Disco";

    const identifier =
        asset.computer?.hostname || asset.patrimony || "Este ativo";

    const handleDelete = async () => {
        setIsDeleting(true);
        setActionError(null);

        try {
            const result = await deleteAssetAction(asset.id);

            // Nota: Se a sua action antiga disparar redirect(), o código não chegará aqui.
            // Mas se ela retornar um objeto, validamos o erro conforme sua estrutura original:
            if (result?.error) {
                setActionError(result.error);
                setIsDeleting(false);
            } else {
                toast.success("Ativo removido com sucesso.");
                setModalOpen(false);
                setIsDeleting(false);
            }
        } catch (err) {
            setActionError("Falha de comunicação com o servidor.");
            setIsDeleting(false);
        }
    };

    return (
        <TooltipProvider delayDuration={200}>
            <TableRow className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                {/* Hostname / Patrimônio */}
                <TableCell className="py-3.5 pl-5">
                    <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 text-sm">
                            <Monitor
                                size={14}
                                className="text-zinc-400 shrink-0"
                            />
                            {asset.computer?.hostname || "Sem Hostname"}
                        </span>
                        <span className="text-xs text-zinc-400 font-mono mt-0.5">
                            {asset.patrimony || "S/ PATRIMÔNIO"}
                        </span>
                    </div>
                </TableCell>

                {/* IP Atribuído */}
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

                {/* Conexão Switch */}
                <TableCell className="py-3.5 hidden sm:table-cell">
                    {asset.connectedToSwitch ? (
                        <div className="flex flex-col text-xs">
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                                <Link2
                                    size={12}
                                    className="text-blue-500 shrink-0"
                                />
                                {asset.connectedToSwitch.hostname ||
                                    "Switch s/ Hostname"}
                            </span>
                            <span className="text-zinc-400 text-[10px] uppercase font-mono mt-0.5">
                                Porta {asset.switchPort || "N/A"}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xs text-zinc-400 italic">
                            Desconectado
                        </span>
                    )}
                </TableCell>

                {/* Usuário Responsável */}
                <TableCell className="py-3.5 hidden md:table-cell text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                    {asset.computer?.username || "Padrão"}
                </TableCell>

                {/* Especificações Técnicas de Hardware */}
                <TableCell className="py-3.5 hidden lg:table-cell">
                    <div className="flex flex-col text-xs text-zinc-500">
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            {asset.computer?.operatingSystem?.name || "N/A"}
                        </span>
                        <span className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1 flex-wrap">
                            <span>
                                {asset.computer?.processor?.name || "Sem CPU"}
                            </span>
                            <span>•</span>
                            <span>{asset.computer?.memory || "Sem RAM"}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-[9px] font-medium text-zinc-600 dark:text-zinc-300">
                                <HardDrive size={9} className="shrink-0" />
                                {diskInfo}
                            </span>
                        </span>
                    </div>
                </TableCell>

                {/* Alocação Operacional */}
                <TableCell className="py-3.5 hidden sm:table-cell">
                    <div className="flex flex-col text-xs">
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                            {asset.department?.name || "Não Vinculado"}
                        </span>
                        <span className="text-[10px] text-zinc-400 mt-0.5">
                            {asset.location?.name || "Sem Prédio"}
                        </span>
                    </div>
                </TableCell>

                {/* Ações Técnicas com Tooltip */}
                <TableCell className="py-3.5 pr-5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                        {/* Notas Popover */}
                        <NotesPopover notes={asset.computer?.notes} />

                        {/* Modal de confirmação (Ele renderiza a lixeira cinza/hover vermelho nativamente)*/}
                        <ConfirmDeleteDialog
                            name={identifier}
                            onConfirm={handleDelete}
                            isDeleting={isDeleting}
                            error={actionError}
                            open={modalOpen}
                            setOpen={setModalOpen}
                        />

                        {/* Botão de Visualização / Ficha Completa */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href={`/assets/computers/${asset.id}`}>
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
                                    Visualizar Ativo
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TableCell>
            </TableRow>
        </TooltipProvider>
    );
}
