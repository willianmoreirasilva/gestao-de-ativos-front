"use client";

import { MoreHorizontal, ShieldCheck, UserX } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { canChangeRole, canDeactivate } from "@/lib/user-roles";
import type { UserRole } from "@/schemas/user";
import type { UserListItem } from "@/types/user";

import { ChangeUserRoleDialog } from "./change-user-role-dialog";
import { DeactivateUserDialog } from "./deactivate-user-dialog";

type Props = {
    user: UserListItem;
    currentUserId: string;
    currentUserRole: UserRole;
};

export function UserRowActions({
    user,
    currentUserId,
    currentUserRole,
}: Props) {
    const [roleOpen, setRoleOpen] = useState(false);
    const [deactivateOpen, setDeactivateOpen] = useState(false);

    const actor = { id: currentUserId, role: currentUserRole };
    const allowRole = canChangeRole(actor, user);
    const allowDeactivate = canDeactivate(actor, user);

    if (!allowRole && !allowDeactivate) {
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
                    {allowRole && allowDeactivate && <DropdownMenuSeparator />}
                    {allowDeactivate && (
                        <DropdownMenuItem
                            className="cursor-pointer gap-2 text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                            onSelect={() => setDeactivateOpen(true)}
                        >
                            <UserX size={14} />
                            Desativar acesso
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
            {allowDeactivate && (
                <DeactivateUserDialog
                    user={user}
                    open={deactivateOpen}
                    onOpenChange={setDeactivateOpen}
                />
            )}
        </>
    );
}
