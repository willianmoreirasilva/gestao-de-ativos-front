import { CheckCircle2, CircleDashed } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    formatDateBR,
    getInitials,
    ROLE_BADGE_VARIANT,
    ROLE_LABELS,
} from "@/lib/user-roles";
import type { UserRole } from "@/schemas/user";
import type { UserListItem } from "@/types/user";

import { UserRowActions } from "./user-row-actions";

type Props = {
    users: UserListItem[];
    currentUserId: string;
    currentUserRole: UserRole;
    emptySlot: React.ReactNode;
};

const COLUMN_COUNT = 7;

export function UsersTable({
    users,
    currentUserId,
    currentUserRole,
    emptySlot,
}: Props) {
    return (
        <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="font-semibold">Usuário</TableHead>
                        <TableHead className="font-semibold hidden md:table-cell">
                            E-mail
                        </TableHead>
                        <TableHead className="font-semibold">Função</TableHead>
                        <TableHead className="font-semibold hidden sm:table-cell">
                            Situação
                        </TableHead>
                        <TableHead className="font-semibold hidden lg:table-cell">
                            E-mail verificado
                        </TableHead>
                        <TableHead className="font-semibold hidden sm:table-cell">
                            Cadastro
                        </TableHead>
                        <TableHead className="w-16 text-right font-semibold pr-4">
                            Ações
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell
                                colSpan={COLUMN_COUNT}
                                className="h-48 text-center"
                            >
                                {emptySlot}
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => {
                            const isSelf = user.id === currentUserId;
                            return (
                                <TableRow
                                    key={user.id}
                                    className={`transition-colors hover:bg-muted/40 ${
                                        user.isActive ? "" : "opacity-70"
                                    }`}
                                >
                                    <TableCell className="py-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Avatar className="h-9 w-9 shrink-0">
                                                {user.image && (
                                                    <AvatarImage
                                                        src={user.image}
                                                        alt={
                                                            user.name ||
                                                            user.email
                                                        }
                                                        className="object-cover"
                                                    />
                                                )}
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                                    {getInitials(
                                                        user.name,
                                                        user.email,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`truncate font-medium ${
                                                            user.name
                                                                ? "text-foreground"
                                                                : "text-muted-foreground italic"
                                                        }`}
                                                    >
                                                        {user.name ||
                                                            "Sem nome"}
                                                    </span>
                                                    {isSelf && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-[10px] px-1.5 py-0"
                                                        >
                                                            Você
                                                        </Badge>
                                                    )}
                                                </div>
                                                {/* No celular o e-mail aparece aqui */}
                                                <p className="text-xs text-muted-foreground truncate md:hidden">
                                                    {user.email}
                                                </p>
                                                <p className="text-xs sm:hidden mt-0.5">
                                                    <StatusLabel
                                                        active={user.isActive}
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                                        <span className="block max-w-64 truncate">
                                            {user.email}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant={
                                                ROLE_BADGE_VARIANT[user.role]
                                            }
                                            className="whitespace-nowrap"
                                        >
                                            {ROLE_LABELS[user.role]}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="hidden sm:table-cell">
                                        <StatusLabel active={user.isActive} />
                                    </TableCell>

                                    <TableCell className="hidden lg:table-cell text-sm">
                                        {user.emailVerified ? (
                                            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                                <CheckCircle2 size={14} />
                                                Verificado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                                                <CircleDashed size={14} />
                                                Não verificado
                                            </span>
                                        )}
                                    </TableCell>

                                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground whitespace-nowrap">
                                        {formatDateBR(user.createdAt)}
                                    </TableCell>

                                    <TableCell className="text-right pr-4">
                                        <UserRowActions
                                            user={user}
                                            currentUserId={currentUserId}
                                            currentUserRole={currentUserRole}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

function StatusLabel({ active }: { active: boolean }) {
    return active ? (
        <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Ativo
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-zinc-400" />
            Inativo
        </span>
    );
}
