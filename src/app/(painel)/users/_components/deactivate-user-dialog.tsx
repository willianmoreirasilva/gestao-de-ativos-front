"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deactivateUserAction } from "@/actions/users";
import { ConfirmDeleteDialog } from "@/components/users/confirm-delete-dialog";
import type { UserListItem } from "@/types/user";

type Props = {
    user: UserListItem;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function DeactivateUserDialog({ user, open, onOpenChange }: Props) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleOpenChange = (next: boolean) => {
        if (isPending) return;
        onOpenChange(next);
        if (!next) setError(null);
    };

    const handleConfirm = () => {
        if (isPending) return;
        setError(null);

        startTransition(async () => {
            const result = await deactivateUserAction(user.id);

            if (result.success) {
                toast.success(result.message);
                onOpenChange(false);
                router.refresh();
                return;
            }

            setError(result.error);
        });
    };

    return (
        <ConfirmDeleteDialog
            trigger={null}
            name={user.name ? `${user.name} (${user.email})` : user.email}
            open={open}
            setOpen={handleOpenChange}
            onConfirm={handleConfirm}
            isDeleting={isPending}
            error={error}
            title="Desativar esta conta?"
            description={(name) => (
                <>
                    Esta operação bloqueará o acesso de {name} ao sistema e
                    revogará suas sessões ativas. Os dados da conta não serão
                    apagados.
                </>
            )}
            confirmLabel="Desativar acesso"
            pendingLabel="Desativando..."
        />
    );
}
