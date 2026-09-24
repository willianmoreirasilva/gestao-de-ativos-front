// src/app/(painel)/audit-logs/page.tsx

import { AuditLogsContainer } from "@/components/audit-logs/audit-log-container";
import { fetchAuditLogs } from "@/services/audit.service"; // ou sua chamada de serviço/API

interface AuditLogsPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        userId?: string;
        action?: string;
        entity?: string;
        startDate?: string;
        endDate?: string;
        search?: string;
    }>;
}

export default async function AuditLogsPage({
    searchParams,
}: AuditLogsPageProps) {
    const params = await searchParams;

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;

    const initialData = await fetchAuditLogs({
        page,
        limit,
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        startDate: params.startDate,
        endDate: params.endDate,
        search: params.search,
    });

    // Renderize o Container (Client Component) e passe o initialData
    return <AuditLogsContainer initialData={initialData} />;
}
