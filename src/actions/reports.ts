"use server";

import { fetchAssetReport } from "@/services/reports.service";
import type { AssetReportResponse, ReportQueryPayload } from "@/types/report";

// Usada pelo componente de cliente na exportação (PDF/Excel), que precisa
// buscar o relatório completo sob demanda. A página usa o service direto.
export async function getAssetReportAction(
    payload: ReportQueryPayload,
): Promise<AssetReportResponse> {
    return fetchAssetReport(payload);
}
