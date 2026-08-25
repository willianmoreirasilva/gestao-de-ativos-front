"use client";

import {
    Camera as CameraIcon,
    Check,
    Copy,
    ExternalLink,
    Eye,
    Link2,
    ShieldAlert,
    Tag,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { NotesPopover } from "@/components/assets/shared/notes-popover";
import { Badge } from "@/components/ui/badge";
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

interface CameraRowItemProps {
    asset: AssetItem;
}

export function CameraRowItem({ asset }: CameraRowItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const identifier =
        asset.camera?.hostname || asset.patrimony || "Câmera sem nome";

    const handleCopyMac = (mac: string) => {
        navigator.clipboard.writeText(mac);
        setCopied(true);
        toast.success(`MAC ${mac} copiado!`, {
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
                toast.success("Câmera removida com sucesso.");
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
                {/* Hostname / Modelo / Patrimônio */}
                <TableCell className="py-3.5 pl-5">
                    <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 text-sm font-mono">
                            <CameraIcon
                                size={15}
                                className="text-blue-600 dark:text-blue-400 shrink-0"
                            />
                            {asset.camera?.hostname || "Hostname não informado"}
                        </span>

                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                {asset.camera?.model || "Modelo não informado"}
                            </span>
                            <span className="text-xs text-zinc-400 font-mono">
                                • {asset.patrimony || "S/ PATRIMÔNIO"}
                            </span>
                        </div>
                    </div>
                </TableCell>

                {/* Canal & MAC */}
                <TableCell className="py-3.5 hidden md:table-cell">
                    <div className="flex flex-col gap-1">
                        {asset.camera?.channel && (
                            <div>
                                <Badge
                                    variant="secondary"
                                    className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono px-1.5 py-0"
                                >
                                    CH{" "}
                                    {String(asset.camera.channel).padStart(
                                        2,
                                        "0",
                                    )}
                                </Badge>
                            </div>
                        )}
                        {asset.camera?.mac ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCopyMac(asset.camera!.mac!)
                                        }
                                        className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer w-fit"
                                    >
                                        <Tag
                                            size={11}
                                            className="text-zinc-400 shrink-0"
                                        />
                                        <span>{asset.camera.mac}</span>
                                        {copied ? (
                                            <Check
                                                size={10}
                                                className="text-emerald-500"
                                            />
                                        ) : (
                                            <Copy
                                                size={10}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            />
                                        )}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p className="text-[10px] font-semibold">
                                        {copied ? "Copiado!" : "Copiar MAC"}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <span className="text-xs text-zinc-400 italic">
                                S/ MAC
                            </span>
                        )}
                    </div>
                </TableCell>

                {/* IP Atribuído com link para Web GUI */}
                <TableCell className="py-3.5">
                    {asset.ip?.address ? (
                        <a
                            href={`http://${asset.ip.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-2 py-1 rounded transition-colors group"
                            title="Abrir Interface Web da Câmera"
                        >
                            <span>{asset.ip.address}</span>
                            <ExternalLink
                                size={11}
                                className="opacity-60 group-hover:opacity-100"
                            />
                        </a>
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
                                    asset.connectedToSwitch.model ||
                                    "Switch"}
                            </span>
                            <span className="text-zinc-400 text-[10px] uppercase font-mono mt-0.5">
                                Porta {asset.switchPort || "N/A"}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xs text-zinc-400 italic">
                            Não Conectado
                        </span>
                    )}
                </TableCell>

                {/* Alocação Operacional */}
                <TableCell className="py-3.5 hidden sm:table-cell">
                    <div className="flex flex-col text-xs">
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                            {asset.location?.name || "Sem Localização"}
                        </span>
                        <span className="text-[10px] text-zinc-400 mt-0.5">
                            {asset.department?.name || "Não Vinculado"}
                        </span>
                    </div>
                </TableCell>

                {/* Ações Técnicas */}
                <TableCell className="py-3.5 pr-5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                        <NotesPopover notes={asset.camera?.notes} />

                        {/* Botão preparado para o módulo de Ocorrências no futuro */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        toast.info(
                                            "Módulo de Ocorrências em breve!",
                                        )
                                    }
                                    className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/40 border border-transparent hover:border-amber-100 dark:hover:border-amber-900/30 rounded-lg transition-all"
                                >
                                    <ShieldAlert size={14} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p className="text-[10px] font-semibold">
                                    Ocorrências / Gravações
                                </p>
                            </TooltipContent>
                        </Tooltip>

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
                                <Link href={`/assets/cameras/${asset.id}`}>
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
                                    Visualizar Câmera
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TableCell>
            </TableRow>
        </TooltipProvider>
    );
}
