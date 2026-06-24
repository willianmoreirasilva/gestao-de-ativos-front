"use client";

import { Department } from "@/types/department";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { TableCell, TableRow } from "../ui/table";
import Link from "next/link";
import { ConfirmDeleteDialog } from "../../components/users/confirm-delete-dialog";
import { useState } from "react";
import { deleteDepartmentAction } from "@/actions/departments";

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

        if (result.error) {
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

    return (
        <TableRow className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
            <TableCell className="font-medium text-zinc-900 dark:text-zinc-100 py-3">
                {department.name}
            </TableCell>

            {/* Alinhamento de ações compacto idêntico ao módulo de locais */}
            <TableCell className="w-24">
                <div className="flex items-center gap-1">
                    <Link href={`/infra/departments/${department.id}`}>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
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