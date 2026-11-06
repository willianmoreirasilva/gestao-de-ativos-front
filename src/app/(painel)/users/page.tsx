import type { Metadata } from "next";

import { AccessDenied } from "@/components/access-denied";
import { ErrorBox } from "@/components/error-box";
import { Pagination } from "@/components/pagination";
import { SearchInput } from "@/components/search-input";
import { EmptyState } from "@/components/users/empty-state";
import { PageTitle } from "@/components/users/page-title";
import { can } from "@/lib/permissions";
import { userService } from "@/services/user";
import type { UserListItem } from "@/types/user";

import { InviteUserDialog } from "./_components/invite-user-dialog";
import { UsersTable } from "./_components/users-table";

export const metadata: Metadata = { title: "Usuários do Sistema" };

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

    if (!can(profile.role, "users", "view")) {
        return (
            <div className="space-y-6">
                <PageTitle title={TITLE} description={DESCRIPTION} />
                <AccessDenied message="Apenas Superadministradores podem gerenciar usuários e permissões." />
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
