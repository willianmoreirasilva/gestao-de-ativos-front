// src/services/audit.service.ts
import { getServerApi } from "@/lib/server-api";
import { extractApiError } from "@/services/user";
import type { AuditLogFilterParams, AuditLogResponse } from "@/types/audit";
import type { ServiceResult } from "@/types/user";

export async function fetchAuditLogs(
    params: AuditLogFilterParams,
): Promise<ServiceResult<AuditLogResponse>> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
        }
    });

    try {
        const api = await getServerApi();
        const queryString = searchParams.toString();
        const url = queryString
            ? `/api/audit-logs?${queryString}`
            : "/api/audit-logs";

        const response = await api.get<AuditLogResponse>(url);
        return { data: response.data, error: null, status: response.status };
    } catch (error) {
        console.error("Erro ao buscar logs de auditoria no servidor:", error);

        const { message, status } = extractApiError(
            error,
            "Não foi possível carregar os logs de auditoria.",
        );

        // Erro do servidor: a mensagem da API pode vir em inglês ou técnica
        if (status !== null && status >= 500) {
            return {
                data: null,
                error: "O servidor encontrou um erro ao carregar os logs de auditoria. Tente novamente em instantes.",
                status,
            };
        }

        return { data: null, error: message, status };
    }
}
