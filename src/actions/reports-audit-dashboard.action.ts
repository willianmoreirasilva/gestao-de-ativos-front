"use server";

import { fetchReportsAuditDashboardData } from "@/services/reports-audit.service";

export async function getReportsAuditDashboardAction() {
    return await fetchReportsAuditDashboardData();
}
