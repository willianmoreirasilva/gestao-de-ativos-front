
export type NetworkUsageItem = {
    networkName: string;
    vlanTag: number | null;
    used: number;
    available: number;
    total: number;
    usagePercentage: number;
}

export type InfraDashboardData = {
    summary: {
        totalNetworks: number;
        totalDepartments: number;
        totalLocations: number;
        totalIpsInUse: number;
        totalIpsAvailable: number;
    };
    networksUsage: NetworkUsageItem[];
}