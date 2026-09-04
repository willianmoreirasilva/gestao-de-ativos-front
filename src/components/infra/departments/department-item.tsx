"use client";

import { Building2, Edit } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { deleteDepartmentAction } from "@/actions/departments";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ConfirmDeleteDialog } from "@/components/users/confirm-delete-dialog";
import { Department } from "@/types/department";

type Props = {
    department: Department;
};

export const DepartmentItem = ({ department }: Props) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        setActionError(null);

        const result = await deleteDepartmentAction(department.id);

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

    const formatDate = (dateString?: string | Date) => {
        if (!dateString) return "—";
        return new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(new Date(dateString));
    };

    return (
        <TableRow className="group transition-colors hover:bg-muted/40">
            <TableCell className="font-medium py-3.5">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground group-hover:border-primary/30 group-hover:text-primary transition-colors">
                        <Building2 size={18} />
                    </div>
                    <span className="text-foreground font-medium">
                        {department.name}
                    </span>
                </div>
            </TableCell>

            <TableCell className="text-muted-foreground text-sm hidden sm:table-cell py-3.5">
                {formatDate(department.createdAt)}
            </TableCell>

            <TableCell className="text-muted-foreground text-sm hidden md:table-cell py-3.5">
                {formatDate(department.updatedAt)}
            </TableCell>

            <TableCell className="w-24 text-right pr-4 py-3.5">
                <div className="flex items-center justify-end gap-1">
                    <Link href={`/infra/departments/${department.id}`}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            title="Editar departamento"
                        >
                            <Edit size={16} />
                        </Button>
                    </Link>

                    <ConfirmDeleteDialog
                        name={department.name}
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
};
