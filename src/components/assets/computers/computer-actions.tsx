"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/users/confirm-delete-dialog";
import { deleteAssetAction } from "@/services/assets";

type Props = {
    assetId: string;
    identifier: string;
};

export function ComputerActions({ assetId, identifier }: Props) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenChange = (open: boolean) => {
        if (open) setActionError(null);
        setModalOpen(open);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        setActionError(null);

        try {
            const result = await deleteAssetAction(assetId);

            if (result?.error) {
                setActionError(result.error);
                setIsDeleting(false);
            } else {
                // 1. Fecha o modal imediatamente
                setModalOpen(false);

                // 2. Avisa o usuário do sucesso
                toast.success("Ativo removido permanentemente do inventário.");

                // 3. Força o Next.js a esquecer o cache das listagens
                router.refresh();

                // 4. Redireciona de volta para a listagem principal
                router.replace("/assets/computers");
            }
        } catch (err) {
            setActionError("Falha de comunicação com o servidor.");
            setIsDeleting(false);
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
                setOpen={handleOpenChange}
            />
        </div>
    );
}
