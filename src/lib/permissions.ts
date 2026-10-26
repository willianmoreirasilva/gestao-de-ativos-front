/**
 * Matriz oficial de permissões por role.
 *
 * Fonte: docs/permissoes.md (repositório do frontend). Este arquivo existe
 * em cópia idêntica nos dois repositórios: o backend o usa para autorizar,
 * o frontend apenas para esconder o que o usuário não pode fazer. Ao alterar
 * aqui, altere também a outra cópia; os testes de cada lado verificam a
 * matriz completa.
 */

export const ROLES = ["SUPERADM", "ADMIN", "CAM_OPERATOR", "USER"] as const;
export type Role = (typeof ROLES)[number];

export const ACTIONS = ["view", "create", "update", "delete"] as const;
export type Action = (typeof ACTIONS)[number];

/**
 * Recursos e o significado das ações em cada um:
 * - users: view = listar; create = convidar; update = alterar role,
 *   inativar e reativar; delete = excluir (anonimizar)
 * - profile: o próprio perfil (nome, foto, senha)
 * - assets: todos os ativos, exceto câmeras
 * - cameras: ativos do tipo CAMERA
 * - reports: relatórios gerais; cameraReports: relatórios só de câmeras
 * - ipReservations: reservar (create) e cancelar (delete) IPs. O
 *   CAM_OPERATOR fica restrito às redes CAMERA_VLAN (ver abaixo)
 */
export const RESOURCES = [
    "users",
    "profile",
    "networks",
    "assets",
    "cameras",
    "departments",
    "locations",
    "reports",
    "cameraReports",
    "auditLogs",
    "ipReservations",
] as const;
export type Resource = (typeof RESOURCES)[number];

const ALL: readonly Role[] = ROLES;
const SUPERADM_ONLY: readonly Role[] = ["SUPERADM"];
const MANAGERS: readonly Role[] = ["SUPERADM", "ADMIN"];

export const PERMISSIONS: Record<
    Resource,
    Partial<Record<Action, readonly Role[]>>
> = {
    users: {
        view: SUPERADM_ONLY,
        create: SUPERADM_ONLY,
        update: SUPERADM_ONLY,
        delete: SUPERADM_ONLY,
    },
    profile: { view: ALL, update: ALL },
    networks: {
        view: ALL,
        create: MANAGERS,
        update: MANAGERS,
        delete: MANAGERS,
    },
    assets: { view: ALL, create: ALL, update: ALL, delete: ALL },
    cameras: {
        view: ["SUPERADM", "ADMIN", "CAM_OPERATOR"],
        create: ["SUPERADM", "CAM_OPERATOR"],
        update: ["SUPERADM", "CAM_OPERATOR"],
        delete: ["SUPERADM", "CAM_OPERATOR"],
    },
    departments: {
        view: ALL,
        create: ALL,
        update: ALL,
        delete: MANAGERS,
    },
    locations: {
        view: ALL,
        create: ALL,
        update: ALL,
        delete: MANAGERS,
    },
    reports: { view: MANAGERS },
    cameraReports: { view: ["SUPERADM", "ADMIN", "CAM_OPERATOR"] },
    auditLogs: { view: SUPERADM_ONLY },
    ipReservations: {
        view: ["SUPERADM", "ADMIN", "CAM_OPERATOR"],
        create: ["SUPERADM", "ADMIN", "CAM_OPERATOR"],
        delete: ["SUPERADM", "ADMIN", "CAM_OPERATOR"],
    },
};

export function can(
    role: Role | null | undefined,
    resource: Resource,
    action: Action,
): boolean {
    if (!role) return false;
    return PERMISSIONS[resource][action]?.includes(role) ?? false;
}

export const CAMERA_TYPE = "CAMERA";
export const CAMERA_NETWORK_TYPE = "CAMERA_VLAN";

/** Recurso que rege um ativo, conforme o tipo dele */
export function assetResource(type: string): "assets" | "cameras" {
    return type === CAMERA_TYPE ? "cameras" : "assets";
}

/** A role enxerga ativos do tipo câmera? (USER não vê) */
export function canSeeCameras(role: Role | null | undefined): boolean {
    return can(role, "cameras", "view");
}

/** O CAM_OPERATOR só reserva IPs em redes de câmeras */
export function reservationNetworkTypes(
    role: Role | null | undefined,
): readonly string[] | null {
    if (!can(role, "ipReservations", "create")) return [];
    return role === "CAM_OPERATOR" ? [CAMERA_NETWORK_TYPE] : null;
}
