"use client";

import { Location } from "@/types/location";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { TableCell, TableRow } from "../ui/table";
import Link from "next/link";
import { ConfirmDeleteDialog } from "../users/confirm-delete-dialog";
import { useState } from "react";
import { deleteLocationAction } from "@/actions/locations";

type Props = { location: Location };

export const LocationItem = ({ location }: Props) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        setActionError(null);
        const result = await deleteLocationAction(location.id);

        if (result.error) {
            setActionError(result.error);
        } else {
            setModalOpen(false);
        }
        setIsDeleting(false);
    };

    return (
        <TableRow>
            <TableCell className="font-medium">{location.name}</TableCell>
            <TableCell>{location.building || "-"}</TableCell>
            <TableCell>{location.floor || "-"}</TableCell>
            <TableCell>{location.room || "-"}</TableCell>
            <TableCell className="flex items-center gap-2">
                <Link href={`/infra/locations/${location.id}`}>
                    <Button variant="outline" size="icon">
                        <Edit size={16} />
                    </Button>
                </Link>
                <ConfirmDeleteDialog
                    name={location.name}
                    onConfirm={handleDelete}
                    isDeleting={isDeleting}
                    error={actionError}
                    open={modalOpen}
                    setOpen={(open) => {
                        setModalOpen(open);
                        if (!open) setActionError(null);
                    }}
                />
            </TableCell>
        </TableRow>
    );
};
