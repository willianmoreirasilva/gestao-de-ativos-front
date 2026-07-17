export interface SwitchAsset {
    id: string;
    patrimony: string | null;
    type: string;
    createdAt: string;
    updatedAt: string;
    ipId: string | null;
    departmentId: string | null;
    locationId: string | null;
}

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

export interface GetSwitchesParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface SwitchAssetPayload {
    patrimony?: string | null;
    departmentId?: string | null;
    locationId?: string | null;
}

export interface CreateSwitchPayload {
    hostname: string | null;
    model: string;
    vendor?: string | null;
    totalPorts: number;
    mac?: string | null;
    notes?: string | null;
    asset?: SwitchAssetPayload;
}

export interface UpdateSwitchPayload {
    hostname: string | null;
    model?: string;
    vendor?: string | null;
    totalPorts?: number;
    mac?: string | null;
    notes?: string | null;
    asset?: SwitchAssetPayload;
}
