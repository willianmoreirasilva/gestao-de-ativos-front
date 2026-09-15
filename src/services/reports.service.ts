"use server";

import { isAxiosError } from "axios";

import { getServerApi } from "@/lib/server-api";
import { AssetReportResponse, ReportQueryPayload } from "@/types/report";

export async function getAssetReportAction(
    payload: ReportQueryPayload,
): Promise<AssetReportResponse> {
    const defaultPage = payload.page ?? 1;
    const defaultLimit = payload.limit ?? 20;

    // Log para inspecionar os filtros e o ID do Sistema Operacional enviados
    console.log(
        "🚀 [SERVER ACTION] Payload enviado para o Backend:",
        JSON.stringify(payload, null, 2),
    );

    try {
        const api = await getServerApi();
        const response = await api.post("/api/reports/assets", payload);

        return {
            data: response.data?.data ?? [],
            meta: response.data?.meta ?? {
                total: 0,
                page: defaultPage,
                limit: defaultLimit,
                totalPages: 0,
            },
            summary: response.data?.summary ?? {
                totalAssets: 0,
                withIp: 0,
                withoutIp: 0,
                departmentsCount: 0,
            },
            error: null,
        };
    } catch (error: unknown) {
        console.error("Erro na Server Action getAssetReportAction:", error);

        let errorMessage = "Falha ao carregar o relatório de ativos.";

        if (isAxiosError(error)) {
            errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                errorMessage;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            data: [],
            meta: {
                total: 0,
                page: defaultPage,
                limit: defaultLimit,
                totalPages: 0,
            },
            summary: {
                totalAssets: 0,
                withIp: 0,
                withoutIp: 0,
                departmentsCount: 0,
            },
            error: errorMessage,
        };
    }
}
