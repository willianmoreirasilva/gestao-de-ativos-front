import { getServerApi } from "@/lib/server-api";
import { extractApiError } from "@/services/user";
import type { InfraDashboardData } from "@/types/infra-dashboard";

export async function fetchInfraDashboardData(): Promise<{
    data: InfraDashboardData | null;
    error: string | null;
}> {
    try {
        const api = await getServerApi();
        const response = await api.get("/api/infra-dashboard");

        return { data: response.data.data, error: null };
    } catch (error: unknown) {
        console.error("Erro ao buscar o dashboard de infraestrutura:", error);

        return {
            data: null,
            error: extractApiError(
                error,
                "Não foi possível carregar o dashboard de infraestrutura.",
            ).message,
        };
    }
}
