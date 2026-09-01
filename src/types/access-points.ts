export interface AccessPointItem {
    id: string;
    name: string | null;
    model: string;
    vendor: string | null;
    mac: string | null;
    ssid: string | null;
    wifiPassword?: string | null;
    securityType?: string | null;
    frequencyBand?: string | null;
    adminUsername?: string | null;
    adminPassword?: string | null;
    firmwareVersion?: string | null;
    notes?: string | null;
    asset: {
        id: string;
        patrimony: string | null;
        vlanType?: string | null; // 👈 Adicionado
        department: {
            id: string;
            name: string;
        } | null;
        location: {
            id: string;
            name: string;
            building: string | null;
            floor: string | null;
            room: string | null;
        } | null;
        ip: {
            id: string;
            address: string;
            network?: {
                // 👈 Adicionado
                type?: string | null;
                vlanTag?: number | null;
            } | null;
        } | null;
    };
}

export interface AccessPointsResponse {
    data: AccessPointItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    error?: string; // 👈 Adicionado para capturar mensagens de falha
}

export interface GetAccessPointsParams {
    page?: number;
    limit?: number;
    search?: string;
    hasIp?: string; // 👈 Adicionado para aceitar "true" | "false" | "ALL"
    departmentId?: string;
    locationId?: string;
}

export interface CreateAccessPointInput {
    patrimony: string;
    departmentId?: string | null;
    locationId?: string | null;
    ipId?: string | null;
    connectedToSwitchId?: string | null;
    switchPort?: number | null;
    name?: string | null;
    vendor?: string | null;
    model?: string | null;
    mac?: string | null;
    ssid?: string | null;
    wifiPassword?: string | null;
    securityType?: string | null;
    frequencyBand?: string | null;
    adminUsername?: string | null;
    adminPassword?: string | null;
    firmwareVersion?: string | null;
    notes?: string | null;
}

export interface UpdateAccessPointInput {
    patrimony?: string;
    departmentId?: string | null;
    locationId?: string | null;
    newIpId?: string | null;
    connectedToSwitchId?: string | null;
    switchPort?: number | null;
    name?: string | null;
    vendor?: string | null;
    model?: string | null;
    mac?: string | null;
    ssid?: string | null;
    wifiPassword?: string | null;
    securityType?: string | null;
    frequencyBand?: string | null;
    adminUsername?: string | null;
    adminPassword?: string | null;
    firmwareVersion?: string | null;
    notes?: string | null;
}
