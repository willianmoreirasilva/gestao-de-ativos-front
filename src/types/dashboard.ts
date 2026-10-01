export type AuditPeriod = "today" | "7d" | "30d";

export type InfraDashboardData = {
    summary: {
        totalNetworks: number;
        totalDepartments: number;
        totalLocations: number;
        totalIpsInUse: number;
        totalIpsAvailable: number;
    };
    networksUsage: {
        networkName: string;
        vlanTag: number | null;
        used: number;
        available: number;
        total: number;
        usagePercentage: number;
    }[];
};

export type AuditDashboardData = {
    summary: {
        totalAssets: number;
        withIp: number;
        withoutIp: number;
        departmentsCount: number;
    };
    recentLogs: {
        id: string;
        action: string;
        entity: string;
        user: string;
        timestamp: string;
    }[];
    operationsSummary: {
        action: string;
        count: number;
    }[];
    topUsers: {
        userName: string;
        operationsCount: number;
    }[];
};

export type ExecutiveDashboardData = {
    infra: InfraDashboardData;
    audit: AuditDashboardData;
};
