import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AccessDenied } from "@/components/access-denied";
import { type Action, can, type Resource } from "@/lib/permissions";
import { userService } from "@/services/user";

type RequirePermissionProps = {
    resource: Resource;
    action: Action;
    message?: string;
    children: ReactNode;
};

/**
 * Guarda de página no servidor: só renderiza o conteúdo quando a role do
 * usuário tem a permissão da matriz. É uma camada de UX; quem autoriza de
 * fato é a API, que também recusa a operação.
 */
export async function RequirePermission({
    resource,
    action,
    message,
    children,
}: RequirePermissionProps) {
    const { data: profile, status } = await userService.getMyProfile();

    if (status === 401) redirect("/login");

    if (!can(profile?.role, resource, action)) {
        return <AccessDenied message={message} />;
    }

    return children;
}
