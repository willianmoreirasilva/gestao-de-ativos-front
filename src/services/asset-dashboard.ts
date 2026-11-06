import { getServerApi } from "@/lib/server-api";
import { extractApiError } from "@/services/user";

export interface AssetTypeStat {
    type:
        | "COMPUTER"
        | "PRINTER"
        | "PHONE"
        | "SWITCH"
        | "ACCESS_POINT"
        | "CAMERA"
        | string;
    count: number;
}

export interface AssetDashboardData {
    summary: {
        totalAssets: number;
        totalDepartments: number;
        // Mapeados via assetsByType
    };
    assetsByType: AssetTypeStat[];
}

export async function fetchAssetDashboardData(): Promise<{
    data: AssetDashboardData | null;
    error: string | null;
}> {
    try {
        const api = await getServerApi();
        // Estatísticas de ativos, já filtradas pelo backend conforme a role
        const response = await api.get("/api/dashboard/stats");

        return { data: response.data.data, error: null };
    } catch (error: unknown) {
        console.error("Erro ao buscar o dashboard de ativos:", error);

        return {
            data: null,
            error: extractApiError(
                error,
                "Não foi possível carregar os dados do dashboard de ativos.",
            ).message,
        };
    }
}
