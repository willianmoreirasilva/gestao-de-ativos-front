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
    processor?: OptionItem | null;
    disk?: OptionItem | null;
    operatingSystem?: OptionItem | null;
    notes?: string | null; // 🌟 Recuperado com segurança
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

export interface SwitchDetails {
    id: string;
    hostname: string | null;
    model: string;
    vendor: string | null;
    totalPorts: number;
    mac: string | null;
    notes: string | null;
}

export interface AccessPointDetails {
    id: string;
    model: string;
    vendor: string | null;
    mac: string | null;
    notes: string | null;
}

export interface AssetItem {
    id: string;
    patrimony: string | null;
    type: AssetType;
    departmentId: string | null;
    locationId: string | null;
    ipId: string | null;

    // 🔌 Conexão física de rede herdada por qualquer tipo
    connectedToSwitchId: string | null;
    switchPort: number | null;

    // 🌟 NOVOS CAMPOS VINDOS DO BACK-END
    vlanType: string; // ex: "GENERAL_DATA", "CAMERA_VLAN"
    vlanTag: number | null; // ex: 10, 20 ou null se não houver

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

    // 🌐 IP atualizado caso você precise acessar algo da rede via asset.ip.network
    ip: {
        id: string;
        address: string;
        network?: any | null; // Deixamos como any para evitar brigas com o schema do banco
    } | null;

    // Relação de conexão do switch resolvido
    connectedToSwitch?: {
        id: string;
        hostname: string;
        model: string;
        vendor: string | null;
    } | null;

    // Sub-especificações opcionais com base no tipo
    computer?: ComputerDetails | null;
    camera?: CameraDetails | null;
    printer?: PrinterDetails | null;
    phone?: PhoneDetails | null;
    switch?: SwitchDetails | null;
    accessPoint?: AccessPointDetails | null;
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

// 🌟 Filtros de Busca atualizados com conexão física
export interface AssetFilters {
    type?: AssetType;
    departmentId?: string;
    locationId?: string;
    networkId?: string;
    connectedToSwitchId?: string; // 🔍 Adicionado filtro por Switch de origem
    hasIp?: "true" | "false";
    search?: string;
    page?: number;
    limit?: number;
}

export interface SystemSpecsModalOptions {
    processors: OptionItem[];
    operatingSystems: OptionItem[];
    disks: OptionItem[];
}
