import { getServerApi } from "@/lib/server-api";
import { AuditPeriod, ExecutiveDashboardData } from "@/types/dashboard";

export const dashboardService = {
    async getExecutiveDashboard(period: AuditPeriod = "7d"): Promise<{
        data: ExecutiveDashboardData | null;
        error: string | null;
    }> {
        try {
            const api = await getServerApi();

            const [infraRes, auditRes] = await Promise.all([
                api.get("/api/infra-dashboard"),
                api.get(`/api/reports/audit-dashboard?period=${period}`),
            ]);

            return {
                data: {
                    infra: infraRes.data.data,
                    audit: auditRes.data.data,
                },
                error: null,
            };
        } catch (error: any) {
            console.error("Erro ao carregar Dashboard Executivo:", error);
            return {
                data: null,
                error:
                    error.response?.data?.error ||
                    "Não foi possível carregar os dados da infraestrutura.",
            };
        }
    },
};
