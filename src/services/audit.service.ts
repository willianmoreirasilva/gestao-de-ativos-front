// src/services/audit.service.ts
import { getServerApi } from "@/lib/server-api";
import type { AuditLogFilterParams, AuditLogResponse } from "@/types/audit";

export async function fetchAuditLogs(
    params: AuditLogFilterParams,
): Promise<AuditLogResponse> {
    const searchParams = new URLSearchParams();
    const api = await getServerApi();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
        }
    });

    try {
        // Ajuste a URL abaixo de acordo com o prefixo do seu backend (ex: /api/audit-logs)
        const queryString = searchParams.toString();
        const url = queryString
            ? `/api/audit-logs?${queryString}`
            : "/audit-logs";

        const response = await api.get<AuditLogResponse>(url);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar logs de auditoria no servidor:", error);

        // Retorno de fallback para evitar quebrar o Server Component
        return {
            data: [],
            meta: { total: 0, page: 1, limit: 20, totalPages: 1 },
        };
    }
}
