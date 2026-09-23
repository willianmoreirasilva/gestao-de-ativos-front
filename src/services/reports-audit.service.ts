import { getServerApi } from "@/lib/server-api";

export interface AuditDashboardStatsResponse {
    summary: {
        totalAssets: number;
        withIp: number;
        withoutIp: number;
        departmentsCount: number;
    };
    recentLogs: Array<{
        id: string;
        action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT";
        entity: string;
        entityId: string;
        details?: Record<string, any> | null; // <-- Adicionado
        createdAt: string;
        user?: {
            id: string;
            name?: string;
            email?: string;
        };
    }>;
    operationsSummary: Array<{
        action: string;
        count: number;
    }>;
    topUsers: Array<{
        userName: string;
        count: number;
    }>;
}

export async function fetchReportsAuditDashboardData(): Promise<{
    data: AuditDashboardStatsResponse | null;
    error: string | null;
}> {
    try {
        const api = await getServerApi();
        const response = await api.get<{ data: AuditDashboardStatsResponse }>(
            "/api/reports/audit-dashboard",
        );

        return {
            data: response.data.data,
            error: null,
        };
    } catch (error) {
        console.error(
            "Erro ao carregar dashboard de relatórios e auditoria:",
            error,
        );
        return {
            data: null,
            error: "Não foi possível carregar os dados de auditoria e relatórios.",
        };
    }
}
