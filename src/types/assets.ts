export type AssetType =
    | "COMPUTER"
    | "PRINTER"
    | "PHONE"
    | "SWITCH"
    | "ACCESS_POINT"
    | "CAMERA"
    | "OTHER";

export type OptionItem = {
    id: string;
    name: string;
};

export interface ComputerDetails {
    id?: string;
    hostname?: string | null;
    username: string;
    memory?: string | null;
    mac?: string | null;
    anydesk?: string | null; // 👈 Adicionado AnyDesk
    processor?: OptionItem | null;
    disk?: OptionItem | null;
    operatingSystem?: OptionItem | null;
    notes?: string | null;
}

export interface CameraDetails {
    id: string;
    model: string;
    hostname?: string | null; // Hostname/Nome amigável
    channel?: string | null; // Canal DVR/NVR
    serial?: string | null;
    mac?: string | null;
    notes?: string | null;
}

export interface PrinterDetails {
    id: string;
    hostname?: string | null;
    model: string;
    code?: string | null; // Código Único de Chamado/Locação
    serial?: string | null;
    notes?: string | null;
}

export interface PhoneDetails {
    id: string;
    hostname?: string | null;
    phoneNumber: string;
    model?: string | null;
    notes?: string | null;
}

export interface SwitchDetails {
    id: string;
    hostname?: string | null;
    model: string;
    vendor?: string | null;
    totalPorts: number;
    mac?: string | null;
    notes?: string | null;
}

export interface AccessPointDetails {
    id: string;
    model: string;
    vendor?: string | null;
    mac?: string | null;
    notes?: string | null;
}

export interface AssetItem {
    id: string;
    patrimony: string | null;
    type: AssetType;
    departmentId: string | null;
    locationId: string | null;
    ipId: string | null;

    connectedToSwitchId: string | null;
    switchPort: number | null;

    vlanType: string;
    vlanTag: number | null;

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

    ip: {
        id: string;
        address: string;
        network?: any | null;
    } | null;

    connectedToSwitch?: {
        id: string;
        hostname: string;
        model: string;
        vendor: string | null;
    } | null;

    computer?: ComputerDetails | null;
    camera?: CameraDetails | null;
    printer?: PrinterDetails | null;
    phone?: PhoneDetails | null;
    switch?: SwitchDetails | null;
    accessPoint?: AccessPointDetails | null;
}

export interface ApiMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiResponseWithMeta<T> {
    data: T;
    meta: ApiMeta;
}

export interface AssetFilters {
    type?: AssetType;
    departmentId?: string;
    locationId?: string;
    networkId?: string;
    connectedToSwitchId?: string;
    hasIp?: "true" | "false" | "ALL";
    search?: string;
    page?: number;
    limit?: number;
}

export interface SystemSpecsModalOptions {
    processors: OptionItem[];
    operatingSystems: OptionItem[];
    disks: OptionItem[];
}

export interface ActionResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    fieldErrors?: Record<string, string[]>;
}
