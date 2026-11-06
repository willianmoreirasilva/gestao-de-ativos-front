export type AuditPeriod = "today" | "7d" | "30d";

export type InfraDashboardData = {
    summary: {
        totalNetworks: number;
        totalDepartments: number;
        totalLocations: number;
        // null: a role não vê estatísticas de uso (USER)
        totalIpsInUse: number | null;
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
        entityId: string;
        createdAt: string;
        user?: {
            id: string;
            name?: string | null;
            email?: string | null;
        };
    }[];
    operationsSummary: {
        action: string;
        count: number;
    }[];
    topUsers: {
        userName: string;
        count: number;
    }[];
};

export type ExecutiveDashboardData = {
    infra: InfraDashboardData;
    totalAssets: number;
    // null para quem não pode ver a auditoria (só o SUPERADM vê)
    audit: AuditDashboardData | null;
};
