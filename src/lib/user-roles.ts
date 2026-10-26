import type { UserRole } from "@/schemas/user";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export const ROLE_LABELS: Record<UserRole, string> = {
    SUPERADM: "Superadministrador",
    ADMIN: "Administrador",
    USER: "Usuário",
    CAM_OPERATOR: "Operador de câmeras",
};

export const ROLE_BADGE_VARIANT: Record<UserRole, BadgeVariant> = {
    SUPERADM: "default",
    ADMIN: "secondary",
    USER: "outline",
    CAM_OPERATOR: "outline",
};

// Espelha a política do backend (requireSuperAdmin). Serve apenas para a
// interface: a API continua sendo a fonte definitiva de autorização.
export function canManageUsers(role: UserRole | null | undefined): boolean {
    return role === "SUPERADM";
}

type Actor = { id: string; role: UserRole };
type Target = { id: string; isActive: boolean };

export function canChangeRole(actor: Actor, target: Target): boolean {
    return canManageUsers(actor.role) && actor.id !== target.id;
}

export function canDeactivate(actor: Actor, target: Target): boolean {
    return (
        canManageUsers(actor.role) && actor.id !== target.id && target.isActive
    );
}

export function getInitials(name: string | null, email: string): string {
    const source = name?.trim() || email;
    const parts = source.split(/[\s@._-]+/).filter(Boolean);
    const initials =
        parts.length > 1 ? parts[0][0] + parts[1][0] : source.slice(0, 2);
    return initials.toUpperCase();
}

export function formatDateBR(value: string | Date | null | undefined): string {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}
