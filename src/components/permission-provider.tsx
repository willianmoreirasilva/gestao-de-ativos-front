"use client";

import { createContext, type ReactNode, useCallback, useContext } from "react";

import { type Action, can, type Resource, type Role } from "@/lib/permissions";

const RoleContext = createContext<Role | null>(null);

// Disponibiliza a role do usuário logado para os componentes do painel
export function RoleProvider({
    role,
    children,
}: {
    role: Role | null;
    children: ReactNode;
}) {
    return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
}

export function useRole() {
    return useContext(RoleContext);
}

/**
 * Consulta a matriz de permissões para a role atual. Serve só para a
 * interface (esconder botões e atalhos); a API é quem autoriza.
 */
export function useCan() {
    const role = useContext(RoleContext);
    return useCallback(
        (resource: Resource, action: Action) => can(role, resource, action),
        [role],
    );
}

type CanProps = {
    resource: Resource;
    action: Action;
    children: ReactNode;
    fallback?: ReactNode;
};

// Renderiza os filhos apenas quando a role atual tem a permissão
export function Can({ resource, action, children, fallback = null }: CanProps) {
    const allowed = useCan()(resource, action);
    return allowed ? children : fallback;
}
