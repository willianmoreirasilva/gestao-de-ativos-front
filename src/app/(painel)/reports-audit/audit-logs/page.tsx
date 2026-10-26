// src/app/(painel)/audit-logs/page.tsx

import { AuditLogsContainer } from "@/components/audit-logs/audit-log-container";
import { RequirePermission } from "@/components/require-permission";
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

async function AuditLogs({ searchParams }: AuditLogsPageProps) {
    const params = await searchParams;

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 8;

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

// Logs de auditoria: exclusivos do SUPERADM
export default function AuditLogsPage(props: AuditLogsPageProps) {
    return (
        <RequirePermission
            resource="auditLogs"
            action="view"
            message="Apenas Superadministradores podem ver os logs de auditoria."
        >
            <AuditLogs {...props} />
        </RequirePermission>
    );
}
