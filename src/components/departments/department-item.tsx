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
    const [actionError, setActionError] = useState<string | null>(null); // 🌟 Guarda o erro
    const [modalOpen, setModalOpen] = useState(false); // 🌟 Controla abertura do modal

    const handleDelete = async () => {
        setIsDeleting(true);
        setActionError(null); // Reseta erros anteriores

        const result = await deleteDepartmentAction(department.id);

        if (result.error) {
            // Se der erro (ex: possui ativos), joga no estado e NÃO fecha o modal
            setActionError(result.error);
        } else {
            // Se der sucesso (204 ou string vazia), fecha o modal limpo
            setModalOpen(false);
        }
        setIsDeleting(false);
    };

    // Sempre que o usuário fechar ou abrir o modal manualmente, limpamos o erro antigo
    const handleModalOpenChange = (open: boolean) => {
        setModalOpen(open);
        if (!open) {
            setActionError(null);
        }
    };

    return (
        <TableRow>
            <TableCell>{department.name}</TableCell>

            <TableCell className="flex items-center gap-2">
                <Link href={`/infra/departments/${department.id}`}>
                    <Button variant="outline">
                        <Edit size={16} />
                    </Button>
                </Link>

                <ConfirmDeleteDialog
                    name={department.name}
                    onConfirm={handleDelete}
                    isDeleting={isDeleting}
                    error={actionError} // 🌟 Passa o erro para o modal
                    open={modalOpen} // 🌟 Passa o estado de aberto
                    setOpen={handleModalOpenChange} // 🌟 Passa a função de controle
                />
            </TableCell>
        </TableRow>
    );
};
