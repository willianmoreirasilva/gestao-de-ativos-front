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

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteDepartmentAction(department.id);

        if (result.error) {
            alert(result.error);
        }
        setIsDeleting(false);
    };

    return (
        <TableRow>
            <TableCell>{department.name}</TableCell>

            <TableCell className="flex items-center gap-2">
                <Link href={`/infra/departments/${department.id}`}>
                    <Button>
                        <Edit />
                    </Button>
                </Link>

                <ConfirmDeleteDialog
                    name={department.name}
                    onConfirm={handleDelete}
                    isDeleting={isDeleting}
                />
            </TableCell>
        </TableRow>
    );
};
