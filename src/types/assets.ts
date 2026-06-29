export type AssetType =
    | "COMPUTER"
    | "PRINTER"
    | "PHONE"
    | "NETWORK_DEVICE"
    | "CAMERA"
    | "OTHER";

export interface ComputerDetails {
    id: string;
    username: string;
    hostname: string | null;
    mac: string | null;
    processor: string | null;
    memory: string | null;
    disk: string | null;
    os: string | null;
}

export interface CameraDetails {
    id: string;
    model: string;
    serial: string | null;
    mac: string | null;
    notes: string | null;
}

export interface PrinterDetails {
    id: string;
    hostname: string | null;
    model: string;
    code: string | null;
    serial: string | null;
    notes: string | null;
}

export interface PhoneDetails {
    id: string;
    phoneNumber: string;
    model: string | null;
    notes: string | null;
}

export interface NetworkDeviceDetails {
    id: string;
    mac: string | null;
    model: string | null;
    vendor: string | null;
    notes: string | null;
}

export interface AssetItem {
    id: string;
    patrimony: string | null;
    type: AssetType;
    departmentId: string | null;
    locationId: string | null;
    ipId: string | null;
    createdAt: string;
    updatedAt: string;
    department: { id: string; name: string } | null;
    location: {
        id: string;
        name: string;
        building: string | null;
        floor: string | null;
        room: string | null;
    } | null;
    ip: { id: string; address: string } | null;
    computer?: ComputerDetails | null;
    camera?: CameraDetails | null;
    printer?: PrinterDetails | null;
    phone?: PhoneDetails | null;
    networkDevice?: NetworkDeviceDetails | null;
}

// 🌟 Objeto de Paginação da API
export interface ApiMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// 🌟 Resposta Completa da Rota
export interface ApiResponseWithMeta<T> {
    data: T;
    meta: ApiMeta;
}

// 🌟 Novos Filtros Suportados pelos Query Parameters
export interface AssetFilters {
    type?: AssetType;
    departmentId?: string;
    locationId?: string;
    networkId?: string;
    hasIp?: "true" | "false";
    search?: string;
    page?: number;
    limit?: number;
}

