"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useState, useTransition } from "react";
import { toast } from "sonner";

import {
    deactivateUserAction,
    deleteUserAction,
    reactivateUserAction,
} from "@/actions/users";
import { ConfirmDeleteDialog } from "@/components/users/confirm-delete-dialog";
import type { UserListItem } from "@/types/user";

export type UserAccountAction = "deactivate" | "reactivate" | "delete";

const CONFIG: Record<
    UserAccountAction,
    {
        run: typeof deactivateUserAction;
        title: string;
        description: (name: ReactNode) => ReactNode;
        confirmLabel: string;
        pendingLabel: string;
    }
> = {
    deactivate: {
        run: deactivateUserAction,
        title: "Desativar esta conta?",
        description: (name) => (
            <>
                Esta operação bloqueará o acesso de {name} ao sistema e revogará
                suas sessões ativas. Os dados da conta não serão apagados.
            </>
        ),
        confirmLabel: "Desativar acesso",
        pendingLabel: "Desativando...",
    },
    reactivate: {
        run: reactivateUserAction,
        title: "Reativar esta conta?",
        description: (name) => (
            <>{name} voltará a acessar o sistema com a mesma senha e função.</>
        ),
        confirmLabel: "Reativar acesso",
        pendingLabel: "Reativando...",
    },
    delete: {
        run: deleteUserAction,
        title: "Excluir esta conta?",
        description: (name) => (
            <>
                Os dados pessoais de {name} serão apagados e a conta não poderá
                mais ser usada. O histórico de auditoria é mantido. Esta ação
                não pode ser desfeita.
            </>
        ),
        confirmLabel: "Excluir conta",
        pendingLabel: "Excluindo...",
    },
};

type Props = {
    user: UserListItem;
    action: UserAccountAction;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

// Confirmação de desativar, reativar ou excluir a conta de um usuário
export function UserAccountDialog({ user, action, open, onOpenChange }: Props) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const config = CONFIG[action];

    const handleOpenChange = (next: boolean) => {
        if (isPending) return;
        onOpenChange(next);
        if (!next) setError(null);
    };

    const handleConfirm = () => {
        if (isPending) return;
        setError(null);

        startTransition(async () => {
            const result = await config.run(user.id);

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
            title={config.title}
            description={config.description}
            confirmLabel={config.confirmLabel}
            pendingLabel={config.pendingLabel}
        />
    );
}
