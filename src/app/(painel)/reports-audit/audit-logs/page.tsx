import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/access-denied";
import { AuditLogsContainer } from "@/components/audit-logs/audit-log-container";
import { ErrorBox } from "@/components/error-box";
import { RequirePermission } from "@/components/require-permission";
import { fetchAuditLogs } from "@/services/audit.service";

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

    const result = await fetchAuditLogs({
        page,
        limit,
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        startDate: params.startDate,
        endDate: params.endDate,
        search: params.search,
    });

    if (result.status === 401) redirect("/login");

    // A API é quem autoriza: o 403 também chega aqui se a role mudou
    if (result.status === 403) {
        return (
            <AccessDenied message="Apenas Superadministradores podem ver os logs de auditoria." />
        );
    }

    // Falha (servidor fora do ar, 500...) nunca pode parecer "nenhum log"
    if (result.error !== null) {
        return (
            <div className="px-1.5 md:px-0">
                <ErrorBox
                    message={result.error}
                    retryHref="/reports-audit/audit-logs"
                />
            </div>
        );
    }

    return <AuditLogsContainer initialData={result.data} />;
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
