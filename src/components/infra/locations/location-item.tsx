"use client";

import { Edit, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { deleteLocationAction } from "@/actions/locations"; // 🌟 Importa a action refatorada de locais
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { TableCell, TableRow } from "@/components/ui/table";
import { ConfirmDeleteDialog } from "@/components/users/confirm-delete-dialog";
import { Location } from "@/types/location";

type Props = {
    location: Location;
};

export function LocationItem({ location }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        setActionError(null);

        const result = await deleteLocationAction(location.id);

        if (result?.error) {
            // Trava o erro na tela interna do modal e impede o fechamento prematuro
            setActionError(result.error);
        } else {
            // Sucesso limpo
            setModalOpen(false);
        }
        setIsDeleting(false);
    };

    const handleModalOpenChange = (open: boolean) => {
        setModalOpen(open);
        if (!open) {
            setActionError(null); // Reseta resquícios de erros ao fechar voluntariamente
        }
    };

    return (
        <TableRow className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
            <TableCell className="font-medium text-zinc-900 dark:text-zinc-100 py-3">
                {location.name}
            </TableCell>
            <TableCell>{location.building || "—"}</TableCell>

            <TableCell className="hidden md:table-cell">
                {location.floor || "—"}
            </TableCell>
            <TableCell className="hidden md:table-cell">
                {location.room || "—"}
            </TableCell>

            <TableCell className="hidden sm:table-cell text-center">
                {location.notes ? (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                                title="Ver observações"
                            >
                                <FileText className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-4 text-sm text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 shadow-md border rounded-md">
                            <div className="space-y-1">
                                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                                    Observações
                                </h4>
                                <p className="whitespace-pre-wrap leading-relaxed">
                                    {location.notes}
                                </p>
                            </div>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <span className="text-zinc-300 dark:text-zinc-700">—</span>
                )}
            </TableCell>

            {/* COLUNA DE AÇÕES ALINHADA */}
            <TableCell className="w-24">
                <div className="flex items-center gap-1">
                    <Link href={`/infra/locations/edit/${location.id}`}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                            title="Editar local"
                        >
                            <Edit size={16} />
                        </Button>
                    </Link>

                    {/* 🌟 DIALOG REUTILIZÁVEL E CONTROLADO */}
                    <ConfirmDeleteDialog
                        name={location.name}
                        onConfirm={handleDelete}
                        isDeleting={isDeleting}
                        error={actionError}
                        open={modalOpen}
                        setOpen={handleModalOpenChange}
                    />
                </div>
            </TableCell>
        </TableRow>
    );
}
