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

/**
 * - view: ver na listagem
 * - viewDetails: abrir a página de detalhes (ativos)
 * - viewSecrets: ver dados sensíveis (credenciais de switch/AP)
 */
export const ACTIONS = [
    "view",
    "viewDetails",
    "viewSecrets",
    "create",
    "update",
    "delete",
] as const;
export type Action = (typeof ACTIONS)[number];

/**
 * Recursos e o significado das ações em cada um:
 * - users: view = listar; create = convidar; update = alterar role,
 *   inativar e reativar; delete = excluir (anonimizar)
 * - profile: o próprio perfil (nome, foto, senha)
 * - assets: ativos comuns (todos, exceto câmeras, switches e APs)
 * - cameras: ativos do tipo CAMERA
 * - networkDevices: ativos do tipo SWITCH e ACCESS_POINT
 * - reports: relatórios gerais; cameraReports: relatórios só de câmeras
 * - ipFree: encontrar IPs e blocos livres
 * - ipUsage: IPs ocupados e a quem pertencem, disponibilidade detalhada
 *   e estatísticas de uso das sub-redes
 * - ipReservations: ver, criar, editar e cancelar reservas de IP
 *
 * Os três recursos de IP têm escopo por tipo de rede: ver ipNetworkScope.
 */
export const RESOURCES = [
    "users",
    "profile",
    "networks",
    "assets",
    "cameras",
    "networkDevices",
    "departments",
    "locations",
    "reports",
    "cameraReports",
    "auditLogs",
    "ipFree",
    "ipUsage",
    "ipReservations",
] as const;
export type Resource = (typeof RESOURCES)[number];

const ALL: readonly Role[] = ROLES;
const SUPERADM_ONLY: readonly Role[] = ["SUPERADM"];
const MANAGERS: readonly Role[] = ["SUPERADM", "ADMIN"];
const CAMERA_VIEWERS: readonly Role[] = ["SUPERADM", "ADMIN", "CAM_OPERATOR"];
const CAMERA_EDITORS: readonly Role[] = ["SUPERADM", "CAM_OPERATOR"];

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
    assets: {
        view: ALL,
        viewDetails: ALL,
        create: ALL,
        update: ALL,
        delete: ALL,
    },
    cameras: {
        view: CAMERA_VIEWERS,
        viewDetails: CAMERA_VIEWERS,
        create: CAMERA_EDITORS,
        update: CAMERA_EDITORS,
        delete: CAMERA_EDITORS,
    },
    networkDevices: {
        view: ALL,
        viewDetails: MANAGERS,
        viewSecrets: MANAGERS,
        create: MANAGERS,
        update: MANAGERS,
        delete: MANAGERS,
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
    cameraReports: { view: CAMERA_VIEWERS },
    auditLogs: { view: SUPERADM_ONLY },
    ipFree: { view: ALL },
    ipUsage: { view: CAMERA_VIEWERS },
    ipReservations: {
        view: CAMERA_VIEWERS,
        create: CAMERA_VIEWERS,
        update: CAMERA_VIEWERS,
        delete: CAMERA_VIEWERS,
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
export const NETWORK_DEVICE_TYPES: readonly string[] = [
    "SWITCH",
    "ACCESS_POINT",
];
export const CAMERA_NETWORK_TYPE = "CAMERA_VLAN";

/** Recurso que rege um ativo, conforme o tipo dele */
export function assetResource(
    type: string,
): "assets" | "cameras" | "networkDevices" {
    if (type === CAMERA_TYPE) return "cameras";
    if (NETWORK_DEVICE_TYPES.includes(type)) return "networkDevices";
    return "assets";
}

/** A role enxerga ativos do tipo câmera? (USER não vê) */
export function canSeeCameras(role: Role | null | undefined): boolean {
    return can(role, "cameras", "view");
}

/**
 * Escopo de tipos de rede (VLAN) em que a role exerce um recurso de IP.
 * - null: sem acesso
 * - {}: todas as redes
 * - { only }: só as redes desses tipos
 * - { exclude }: todas, exceto as desses tipos
 *
 * O USER não enxerga a VLAN de câmeras em lugar nenhum; o CAM_OPERATOR vê
 * uso e reservas só na VLAN de câmeras (nas outras, só IPs livres).
 */
export type NetworkScope = {
    only?: readonly string[];
    exclude?: readonly string[];
};

export function ipNetworkScope(
    role: Role | null | undefined,
    resource: "ipFree" | "ipUsage" | "ipReservations",
    action: Action = "view",
): NetworkScope | null {
    if (!can(role, resource, action)) return null;
    if (!canSeeCameras(role)) return { exclude: [CAMERA_NETWORK_TYPE] };
    if (role === "CAM_OPERATOR" && resource !== "ipFree") {
        return { only: [CAMERA_NETWORK_TYPE] };
    }
    return {};
}

/** O tipo de rede está dentro do escopo? */
export function inNetworkScope(
    scope: NetworkScope | null,
    networkType: string,
): boolean {
    if (!scope) return false;
    if (scope.only && !scope.only.includes(networkType)) return false;
    if (scope.exclude?.includes(networkType)) return false;
    return true;
}

/** A role pode gerenciar (ação sobre) reservas nesta VLAN? */
export function canManageVlan(
    role: Role | null | undefined,
    networkType: string,
    action: Action = "create",
): boolean {
    return inNetworkScope(
        ipNetworkScope(role, "ipReservations", action),
        networkType,
    );
}

/** A role enxerga a rede deste tipo? (USER não vê a VLAN de câmeras) */
export function canSeeNetworkType(
    role: Role | null | undefined,
    networkType: string,
): boolean {
    return inNetworkScope(ipNetworkScope(role, "ipFree"), networkType);
}

/**
 * Tipos de rede em que a role pode reservar: [] = nenhum, null = todos.
 * Atalho de ipNetworkScope(role, "ipReservations", "create").
 */
export function reservationNetworkTypes(
    role: Role | null | undefined,
): readonly string[] | null {
    const scope = ipNetworkScope(role, "ipReservations", "create");
    if (!scope) return [];
    return scope.only ?? null;
}
