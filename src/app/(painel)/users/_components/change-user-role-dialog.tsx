"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateUserRoleAction } from "@/actions/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ROLE_BADGE_VARIANT, ROLE_LABELS } from "@/lib/user-roles";
import { USER_ROLES, type UserRole, userRoleSchema } from "@/schemas/user";
import type { UserListItem } from "@/types/user";

type Props = {
    user: UserListItem;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function ChangeUserRoleDialog({ user, open, onOpenChange }: Props) {
    const router = useRouter();
    const [newRole, setNewRole] = useState<UserRole | "">("");
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleOpenChange = (next: boolean) => {
        if (isPending) return;
        onOpenChange(next);
        if (!next) {
            setNewRole("");
            setError(null);
        }
    };

    const handleValueChange = (value: string) => {
        const parsed = userRoleSchema.safeParse(value);
        if (parsed.success) setNewRole(parsed.data);
    };

    const handleConfirm = () => {
        if (!newRole || newRole === user.role || isPending) return;
        setError(null);

        startTransition(async () => {
            const result = await updateUserRoleAction(user.id, {
                role: newRole,
            });

            if (result.success) {
                toast.success(result.message);
                onOpenChange(false);
                setNewRole("");
                router.refresh();
                return;
            }

            setError(result.error);
            toast.error(result.error);
        });
    };

    const availableRoles = USER_ROLES.filter((role) => role !== user.role);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Alterar função</DialogTitle>
                    <DialogDescription>
                        A nova função define o que este usuário pode acessar no
                        sistema.
                    </DialogDescription>
                </DialogHeader>

                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-lg border bg-muted/40 p-3 text-sm">
                    <dt className="text-muted-foreground">Nome</dt>
                    <dd className="font-medium truncate">
                        {user.name || "Sem nome"}
                    </dd>
                    <dt className="text-muted-foreground">E-mail</dt>
                    <dd className="truncate">{user.email}</dd>
                    <dt className="text-muted-foreground">Função atual</dt>
                    <dd>
                        <Badge variant={ROLE_BADGE_VARIANT[user.role]}>
                            {ROLE_LABELS[user.role]}
                        </Badge>
                    </dd>
                </dl>

                <div className="space-y-2">
                    <Label htmlFor={`new-role-${user.id}`}>Nova função</Label>
                    <Select
                        value={newRole}
                        onValueChange={handleValueChange}
                        disabled={isPending}
                    >
                        <SelectTrigger id={`new-role-${user.id}`}>
                            <SelectValue placeholder="Selecione a nova função" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableRoles.map((role) => (
                                <SelectItem key={role} value={role}>
                                    {ROLE_LABELS[role]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="flex items-start gap-3 text-destructive text-sm p-3 bg-destructive/10 rounded-lg border border-destructive/20"
                    >
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!newRole || isPending}
                        className="gap-2"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            "Confirmar alteração"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
