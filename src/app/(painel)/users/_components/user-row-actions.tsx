"use client";

import {
    MoreHorizontal,
    ShieldCheck,
    Trash2,
    UserCheck,
    UserX,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    canChangeRole,
    canDeactivate,
    canDeleteUser,
    canReactivate,
} from "@/lib/user-roles";
import type { UserRole } from "@/schemas/user";
import type { UserListItem } from "@/types/user";

import { ChangeUserRoleDialog } from "./change-user-role-dialog";
import {
    type UserAccountAction,
    UserAccountDialog,
} from "./user-account-dialog";

type Props = {
    user: UserListItem;
    currentUserId: string;
    currentUserRole: UserRole;
};

const DANGER =
    "cursor-pointer gap-2 text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400";

export function UserRowActions({
    user,
    currentUserId,
    currentUserRole,
}: Props) {
    const [roleOpen, setRoleOpen] = useState(false);
    const [accountAction, setAccountAction] =
        useState<UserAccountAction | null>(null);

    const actor = { id: currentUserId, role: currentUserRole };
    const allowRole = canChangeRole(actor, user);
    const allowDeactivate = canDeactivate(actor, user);
    const allowReactivate = canReactivate(actor, user);
    const allowDelete = canDeleteUser(actor, user);

    if (!allowRole && !allowDeactivate && !allowReactivate && !allowDelete) {
        return <span className="sr-only">Nenhuma ação disponível</span>;
    }

    const label = user.name || user.email;

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-foreground"
                        aria-label={`Ações para ${label}`}
                    >
                        <MoreHorizontal size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    {allowRole && (
                        <DropdownMenuItem
                            className="cursor-pointer gap-2"
                            onSelect={() => setRoleOpen(true)}
                        >
                            <ShieldCheck size={14} />
                            Alterar função
                        </DropdownMenuItem>
                    )}
                    {allowReactivate && (
                        <DropdownMenuItem
                            className="cursor-pointer gap-2"
                            onSelect={() => setAccountAction("reactivate")}
                        >
                            <UserCheck size={14} />
                            Reativar acesso
                        </DropdownMenuItem>
                    )}
                    {(allowRole || allowReactivate) &&
                        (allowDeactivate || allowDelete) && (
                            <DropdownMenuSeparator />
                        )}
                    {allowDeactivate && (
                        <DropdownMenuItem
                            className={DANGER}
                            onSelect={() => setAccountAction("deactivate")}
                        >
                            <UserX size={14} />
                            Desativar acesso
                        </DropdownMenuItem>
                    )}
                    {allowDelete && (
                        <DropdownMenuItem
                            className={DANGER}
                            onSelect={() => setAccountAction("delete")}
                        >
                            <Trash2 size={14} />
                            Excluir conta
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {allowRole && (
                <ChangeUserRoleDialog
                    user={user}
                    open={roleOpen}
                    onOpenChange={setRoleOpen}
                />
            )}
            {accountAction && (
                <UserAccountDialog
                    user={user}
                    action={accountAction}
                    open
                    onOpenChange={(open) => {
                        if (!open) setAccountAction(null);
                    }}
                />
            )}
        </>
    );
}
