export interface NetworkUsageItem {
    networkName: string;
    vlanTag: number | null;
    used: number;
    available: number;
    total: number;
    usagePercentage: number;
}

export interface InfraDashboardData {
    summary: {
        totalNetworks: number;
        totalDepartments: number;
        totalLocations: number;
        // null: a role não vê estatísticas de uso (USER)
        totalIpsInUse: number | null;
        totalIpsAvailable: number;
    };
    networksUsage: NetworkUsageItem[];
}
