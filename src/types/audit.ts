export type AuditAction =
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "LOGIN"
    | "LOGOUT"
    | "EXPORT"
    | string;

export interface AuditUser {
    id: string;
    name: string;
    email: string;
    image?: string | null;
}

export interface AuditLog {
    id: string;
    action: AuditAction;
    entity: string;
    entityId: string;
    details: Record<string, any> | null;
    createdAt: string;
    user: AuditUser;
}

export interface AuditLogResponse {
    data: AuditLog[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface AuditLogFilterParams {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    entity?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}

// Mapeamento visual e amigável para Entidades
export const ENTITY_LABELS: Record<string, string> = {
    ASSET: "Ativo",
    COMPUTER: "Computador",
    PRINTER: "Impressora",
    SWITCH: "Switch",
    ACCESS_POINT: "Access Point",
    CAMERA: "Câmera",
    PHONE: "Telefone",
    NETWORK: "Rede",
    DEPARTMENT: "Departamento",
    LOCATION: "Localização",
    USER: "Usuário",
    IP: "Endereço IP",
};
