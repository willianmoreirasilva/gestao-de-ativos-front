// --- Sub-relações do Asset ---
export interface SwitchDepartment {
    id: string;
    name: string;
}

export interface SwitchLocation {
    id: string;
    name: string;
    building?: string | null;
    floor?: string | null;
    room?: string | null;
}

export interface SwitchIp {
    id: string;
    address: string;
}

// --- Entidade Asset Pai ---
export interface SwitchAsset {
    id: string;
    patrimony: string | null;
    type: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    ipId: string | null;
    departmentId: string | null;
    locationId: string | null;
    // Relacionamentos populados pelo include do backend:
    department?: SwitchDepartment | null;
    location?: SwitchLocation | null;
    ip?: SwitchIp | null;
}

// --- Item Principal da Lista ---
export interface SwitchItem {
    id: string;
    hostname: string | null;
    model: string;
    vendor: string | null;
    totalPorts: number;
    mac: string | null;
    notes: string | null;
    asset: SwitchAsset;
}

// --- Parâmetros de Query da Lista ---
export interface GetSwitchesParams {
    page?: number;
    limit?: number;
    search?: string;
    hasIp?: "true" | "false" | "ALL";
}

// --- Payloads para Mutações (CRUD) ---
export interface CreateSwitchPayload {
    patrimony?: string | null;
    departmentId?: string | null;
    locationId?: string | null;
    ipId: string; // Obrigatório no backend para criação de Switch
    hostname?: string | null;
    model: string;
    vendor?: string | null;
    totalPorts?: number;
    mac?: string | null;
    notes?: string | null;
}

export interface UpdateSwitchPayload {
    patrimony?: string | null;
    departmentId?: string | null;
    locationId?: string | null;
    newIpId?: string | null;
    hostname?: string | null;
    model?: string;
    vendor?: string | null;
    totalPorts?: number;
    mac?: string | null;
    notes?: string | null;
}
