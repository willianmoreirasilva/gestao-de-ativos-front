import { apiErrorMessage, getApiErrorStatus } from "@/lib/api-error";
import { can, type Role } from "@/lib/permissions";
import { getServerApi } from "@/lib/server-api";
import { AuditPeriod, ExecutiveDashboardData } from "@/types/dashboard";

export const dashboardService = {
    async getExecutiveDashboard(
        period: AuditPeriod = "7d",
        role: Role | null = null,
    ): Promise<{
        data: ExecutiveDashboardData | null;
        error: string | null;
    }> {
        try {
            const api = await getServerApi();

            // O painel de auditoria é exclusivo do SUPERADM; para as demais
            // roles o dashboard é montado sem ele
            const canSeeAudit = can(role, "auditLogs", "view");

            const [infraRes, statsRes, auditRes] = await Promise.all([
                api.get("/api/infra-dashboard"),
                // Total de ativos já filtrado pelo backend conforme a role
                api.get("/api/dashboard/stats"),
                canSeeAudit
                    ? api.get(`/api/reports/audit-dashboard?period=${period}`)
                    : Promise.resolve(null),
            ]);

            return {
                data: {
                    infra: infraRes.data.data,
                    totalAssets: statsRes.data.data.summary.totalAssets,
                    audit: auditRes?.data.data ?? null,
                },
                error: null,
            };
        } catch (error) {
            // 401 = sessão expirada; o painel redireciona para o login
            if (getApiErrorStatus(error) !== 401) {
                console.error("Erro ao carregar Dashboard Executivo:", error);
            }
            return {
                data: null,
                error: apiErrorMessage(
                    error,
                    "Não foi possível carregar os dados da infraestrutura.",
                    "error",
                ),
            };
        }
    },
};
