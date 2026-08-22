"use client";

import {
    Check,
    Copy,
    Eye,
    Link2,
    Printer as PrinterIcon,
    Tag,
} from "lucide-react";
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

interface PrinterRowItemProps {
    asset: AssetItem;
}

export function PrinterRowItem({ asset }: PrinterRowItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const identifier =
        asset.printer?.model || asset.patrimony || "Impressora sem nome";

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success(`Código ${code} copiado!`, {
            position: "bottom-right",
        });

        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        setActionError(null);

        try {
            const result = await deleteAssetAction(asset.id);

            if (result?.error) {
                setActionError(result.error);
                setIsDeleting(false);
            } else {
                toast.success("Impressora removida com sucesso.");
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
                {/* Modelo / Patrimônio / Código de Chamado */}
                <TableCell className="py-3.5 pl-5">
                    <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 text-sm">
                            <PrinterIcon
                                size={15}
                                className="text-purple-600 dark:text-purple-400 shrink-0"
                            />
                            {asset.printer?.model || "Modelo não informado"}
                        </span>

                        <div className="flex items-center gap-2 mt-1">
                            {/* Patrimônio */}
                            <span className="text-xs text-zinc-400 font-mono">
                                {asset.patrimony || "S/ PATRIMÔNIO"}
                            </span>

                            {/* Badge Interativo com Copiar do Código de Chamado */}
                            {asset.printer?.code && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCopyCode(
                                                    asset.printer!.code!,
                                                )
                                            }
                                            className="inline-flex items-center gap-1 text-[10px] bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 dark:text-purple-300 px-1.5 py-0.5 rounded border border-purple-200/60 dark:border-purple-800/40 font-mono transition-colors group cursor-pointer"
                                        >
                                            <span>
                                                Cód: {asset.printer.code}
                                            </span>
                                            {copied ? (
                                                <Check
                                                    size={10}
                                                    className="text-emerald-500"
                                                />
                                            ) : (
                                                <Copy
                                                    size={10}
                                                    className="opacity-60 group-hover:opacity-100 transition-opacity"
                                                />
                                            )}
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p className="text-[10px] font-semibold">
                                            {copied
                                                ? "Copiado!"
                                                : "Copiar Código do Chamado"}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                </TableCell>

                {/* Número de Série */}
                <TableCell className="py-3.5 hidden md:table-cell">
                    <div className="flex items-center gap-1 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                        <Tag size={12} className="text-zinc-400 shrink-0" />
                        {asset.printer?.serial || "N/A"}
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

                {/* Alocação Operacional */}
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

                {/* Ações Técnicas */}
                <TableCell className="py-3.5 pr-5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                        <NotesPopover notes={asset.printer?.notes} />

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
                                <Link href={`/assets/printers/${asset.id}`}>
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
                                    Visualizar Impressora
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TableCell>
            </TableRow>
        </TooltipProvider>
    );
}
