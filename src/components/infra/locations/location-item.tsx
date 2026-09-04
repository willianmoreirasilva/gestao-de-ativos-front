"use client";

import { Building2, Edit, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { deleteLocationAction } from "@/actions/locations";
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
            setActionError(result.error);
        } else {
            setModalOpen(false);
        }
        setIsDeleting(false);
    };

    const handleModalOpenChange = (open: boolean) => {
        setModalOpen(open);
        if (!open) {
            setActionError(null);
        }
    };

    // 💡 Tipo ajustado para aceitar `undefined` do tipo Location
    const renderFloor = (floor?: string | null) => {
        if (!floor || floor.trim().toUpperCase() === "N/A") {
            return <span className="text-muted-foreground/50">—</span>;
        }
        return <span>{floor}º Andar</span>;
    };

    return (
        <TableRow className="hover:bg-muted/50 transition-colors">
            {/* Nome do Local com Ícone Padronizado */}
            <TableCell className="font-medium text-foreground py-3.5">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-foreground">
                        {location.name}
                    </span>
                </div>
            </TableCell>

            {/* Prédio/Bloco */}
            <TableCell className="py-3.5 text-muted-foreground">
                {location.building &&
                location.building.trim().toUpperCase() !== "N/A" ? (
                    <span className="text-foreground font-normal">
                        {location.building}
                    </span>
                ) : (
                    <span className="text-muted-foreground/50">—</span>
                )}
            </TableCell>

            {/* Andar */}
            <TableCell className="hidden md:table-cell py-3.5 text-muted-foreground">
                {renderFloor(location.floor)}
            </TableCell>

            {/* Sala */}
            <TableCell className="hidden md:table-cell py-3.5 text-muted-foreground">
                {location.room ? (
                    <span>Sala {location.room}</span>
                ) : (
                    <span className="text-muted-foreground/50">—</span>
                )}
            </TableCell>

            {/* Observações / Notas */}
            <TableCell className="hidden sm:table-cell text-center py-3.5">
                {location.notes ? (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-md"
                                title="Ver observações"
                            >
                                <FileText className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4 text-sm bg-popover text-popover-foreground shadow-lg border border-border rounded-lg">
                            <div className="space-y-1.5">
                                <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                                    Observações
                                </h4>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                                    {location.notes}
                                </p>
                            </div>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <span className="text-muted-foreground/50">—</span>
                )}
            </TableCell>

            {/* Coluna de Ações */}
            <TableCell className="w-24 py-3.5 text-right">
                <div className="flex items-center justify-end gap-1">
                    <Link href={`/infra/locations/edit/${location.id}`}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                            title="Editar local"
                        >
                            <Edit size={15} />
                        </Button>
                    </Link>

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
