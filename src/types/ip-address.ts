export type IpStatus = "AVAILABLE" | "IN_USE" | "RESERVED";

export type AssetSummary = {
    id: string;
    type: string;
    patrimony: string | null;
    computer?: { hostname: string | null; username: string };
    printer?: { model: string; hostname: string | null };
    camera?: { model: string; mac: string | null };
    phone?: { model: string | null; phoneNumber: string };
    networkDevice?: { model: string | null; mac: string | null };
};

export type NetworkSummary = {
    id: string;
    networkAddress: string;
    cidr: number;
    vlanTag: number | null;
    type?: string;
};

export type IpAddress = {
    id: string;
    address: string;
    addressInt: string | number;
    status: IpStatus;
    networkId: string;
    reservationReason?: string | null;
    reservedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
    network?: NetworkSummary | null;
    asset: AssetSummary | null;
};

// --- Tipos para Métricas e Respostas dos novos Endpoints ---

export type IpStatusStat = {
    status: IpStatus;
    count: number;
};

export type NetworkUsageMetric = {
    id: string;
    networkAddress: string;
    cidr: number;
    vlanTag: number | null;
    type: string;
    used: number;
    reserved: number;
    available: number;
    total: number;
    usagePercentage: number;
};

export type OverviewStatsResponse = {
    summary: {
        total: number;
        inUse: number;
        available: number;
        reserved: number;
    };
    networksUsage: NetworkUsageMetric[];
};

export type FindAvailableIpsResponse = {
    network: {
        address: string;
        cidr: number;
        vlanTag: number | null;
    };
    requested: number;
    available: number;
    ips: string[];
};

export type VerifyIpResponse = {
    valid: boolean;
    reason?: string;
    currentAssetId?: string;
};

export type PaginatedMeta = {
    total: number;
    offset?: number;
    limit: number;
    page?: number;
    totalPages?: number;
};
