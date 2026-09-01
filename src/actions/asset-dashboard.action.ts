"use server";

import { getServerApi } from "@/lib/server-api";

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

interface ActionResponse {
    data: AssetDashboardData | null;
    error: string | null;
}

export async function getAssetDashboardData(): Promise<ActionResponse> {
    try {
        const api = await getServerApi();
        // Consome o endpoint existente que traz as estatísticas de ativos
        const response = await api.get("/api/dashboard/stats");

        return {
            data: response.data.data,
            error: null,
        };
    } catch (error: unknown) {
        console.error("Erro na Action getAssetDashboardData:", error);

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
                "Não foi possível carregar os dados do dashboard de ativos.",
        };
    }
}
