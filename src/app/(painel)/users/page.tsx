import { AlertCircle, ShieldOff } from "lucide-react";
import Link from "next/link";

import { Pagination } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/users/empty-state";
import { PageTitle } from "@/components/users/page-title";
import { canManageUsers } from "@/lib/user-roles";
import { userService } from "@/services/user";
import type { UserListItem } from "@/types/user";

import { InviteUserDialog } from "./_components/invite-user-dialog";
import { UsersTable } from "./_components/users-table";

type Props = {
    searchParams: Promise<{ page?: string; limit?: string; q?: string }>;
};

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

function parsePositiveInt(value: string | undefined, fallback: number) {
    const parsed = Number.parseInt(value ?? "", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const TITLE = "Usuários do Sistema";
const DESCRIPTION =
    "Gerencie usuários, funções e acesso ao sistema de gestão de TI.";

export default async function UsersPage({ searchParams }: Props) {
    const params = await searchParams;
    const page = parsePositiveInt(params.page, 1);
    const limit = Math.min(
        parsePositiveInt(params.limit, DEFAULT_LIMIT),
        MAX_LIMIT,
    );
    const query = params.q?.trim() || "";

    const profileRes = await userService.getMyProfile();

    if (!profileRes.data) {
        return (
            <div className="space-y-6">
                <PageTitle title={TITLE} description={DESCRIPTION} />
                <ErrorBox message={profileRes.error} />
            </div>
        );
    }

    const profile = profileRes.data;

    if (!canManageUsers(profile.role)) {
        return (
            <div className="space-y-6">
                <PageTitle title={TITLE} description={DESCRIPTION} />
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto space-y-3">
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-400">
                        <ShieldOff size={28} strokeWidth={1.5} />
                    </div>
                    <h2 className="font-semibold text-foreground">
                        Acesso restrito
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Apenas Superadministradores podem gerenciar usuários e
                        permissões.
                    </p>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/dashboard">Voltar ao início</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const listRes = await userService.listUsers({
        page,
        limit,
        search: query || undefined,
    });

    const pageTitle = (
        <PageTitle
            title={TITLE}
            description={DESCRIPTION}
            rightSide={<InviteUserDialog />}
        />
    );

    if (!listRes.data) {
        return (
            <div className="space-y-6">
                {pageTitle}
                <ErrorBox message={listRes.error} retryHref="/users" />
            </div>
        );
    }

    const { users, meta } = listRes.data;

    const emptySlot = query ? (
        <EmptyState message={`Nenhum usuário encontrado para "${query}".`} />
    ) : meta.total === 0 ? (
        <EmptyState message="Nenhum usuário cadastrado até o momento." />
    ) : (
        <EmptyState
            message="Nenhum resultado nesta página."
            label="Voltar para a página 1"
            href="?page=1"
        />
    );

    return (
        <div className="space-y-6">
            {pageTitle}

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="w-full max-w-sm">
                    <SearchInput
                        placeholder="Buscar por nome ou e-mail..."
                        queryParamName="q"
                    />
                </div>
                <PageIndicators users={users} total={meta.total} />
            </div>

            <UsersTable
                users={users}
                currentUserId={profile.id}
                currentUserRole={profile.role}
                emptySlot={emptySlot}
            />

            {meta.totalPages > 0 && meta.total > 0 && (
                <Pagination {...meta} itemLabel="usuários" />
            )}
        </div>
    );
}

// O backend não oferece contagens agregadas: apenas o total é global.
// Os demais números refletem somente os registros desta página.
function PageIndicators({
    users,
    total,
}: {
    users: UserListItem[];
    total: number;
}) {
    const count = (predicate: (u: UserListItem) => boolean) =>
        users.filter(predicate).length;

    const pageStats = [
        {
            label: "administradores",
            value: count((u) => u.role === "ADMIN" || u.role === "SUPERADM"),
        },
        { label: "usuários", value: count((u) => u.role === "USER") },
        {
            label: "operadores",
            value: count((u) => u.role === "CAM_OPERATOR"),
        },
        { label: "inativos", value: count((u) => !u.isActive) },
    ];

    return (
        <div className="text-xs text-muted-foreground sm:text-right space-y-1">
            <p>
                Total:{" "}
                <strong className="text-foreground text-sm">{total}</strong>{" "}
                usuário(s)
            </p>
            {users.length > 0 && (
                <p>
                    Nesta página:{" "}
                    {pageStats.map((stat, index) => (
                        <span key={stat.label}>
                            {index > 0 && " · "}
                            <strong className="text-foreground">
                                {stat.value}
                            </strong>{" "}
                            {stat.label}
                        </span>
                    ))}
                </p>
            )}
        </div>
    );
}

function ErrorBox({
    message,
    retryHref,
}: {
    message: string;
    retryHref?: string;
}) {
    return (
        <div
            role="alert"
            className="flex flex-col sm:flex-row sm:items-center gap-3 text-destructive text-sm p-4 bg-destructive/10 rounded-lg border border-destructive/20"
        >
            <div className="flex items-start gap-3 flex-1">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{message}</span>
            </div>
            {retryHref && (
                <Button asChild variant="outline" size="sm">
                    <Link href={retryHref}>Tentar novamente</Link>
                </Button>
            )}
        </div>
    );
}
