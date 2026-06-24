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
        totalIpsInUse: number;
        totalIpsAvailable: number;
    };
    networksUsage: NetworkUsageItem[];
}
