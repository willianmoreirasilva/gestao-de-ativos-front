"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
