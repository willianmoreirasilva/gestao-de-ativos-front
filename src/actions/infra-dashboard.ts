"use server";

import { getServerApi } from "@/lib/server-api";
import { InfraDashboardData } from "@/types/infra-dashboard";

interface ActionResponse {
    data: InfraDashboardData | null;
    error: string | null;
}

/**
 * Server Action responsável por buscar os dados consolidados da infraestrutura técnica
 */
export async function getInfraDashboardData(): Promise<ActionResponse> {
    try {
        const api = await getServerApi();
        const response = await api.get("/api/infra/dashboard");

        return {
            data: response.data.data,
            error: null
        };
    } catch (error: unknown) {
        console.error("Erro na Action getInfraDashboardData:", error);

        const extractErrorMessage = (err: unknown): string | undefined => {
            if (typeof err === "object" && err !== null && "response" in err) {
                const e = err as {
                    response?: { data?: { error?: string } };
                };
                return e.response?.data?.error;
            }
            return undefined;
        };

        return {
            data: null,
            error:
                extractErrorMessage(error) ||
                "Não foi possível carregar o dashboard de infraestrutura."
        };
    }
}