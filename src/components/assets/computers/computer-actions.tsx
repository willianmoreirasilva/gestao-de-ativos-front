"use client";

import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/users/confirm-delete-dialog";
import { deleteAssetAction } from "@/services/assets";

type Props = {
    assetId: string;
    identifier: string; // Hostname ou Patrimônio para exibir no modal
};

export function ComputerActions({ assetId, identifier }: Props) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        setActionError(null);

        const result = await deleteAssetAction(assetId);

        if (result?.error) {
            setActionError(result.error);
            setIsDeleting(false);
        } else {
            setModalOpen(false);
            setIsDeleting(false);
            // Redireciona de volta para a listagem principal após apagar
            router.push("/assets/computers");
        }
    };

    return (
        <div className="flex items-center gap-3">
            <Link href={`/assets/computers/${assetId}/edit/`}>
                <Button variant="outline" className="flex items-center gap-2">
                    <Edit size={16} />
                    Editar Ativo
                </Button>
            </Link>

            <ConfirmDeleteDialog
                name={identifier}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                error={actionError}
                open={modalOpen}
                setOpen={setModalOpen}
            />
        </div>
    );
}
