import { ENTITY_LABELS } from "@/types/audit";

export interface LogDetails {
    type?: string;
    createdData?: { type?: string };
    before?: { type?: string };
    after?: { type?: string };
    [key: string]: any;
}

export interface AuditEntityItem {
    entity: string;
    details?: LogDetails | null;
}

/**
 * Helper para identificar o tipo específico do Ativo através dos details do Log de Auditoria.
 * Pode ser chamado tanto no Server quanto no Client.
 */
export function getFormattedEntity(log: AuditEntityItem): string {
    const entityUpper = log.entity?.toUpperCase();

    // Se for um ativo, tenta buscar o subtipo dentro de details
    if (entityUpper === "ASSET" && log.details) {
        const details = log.details;

        const assetType = (
            details.type ||
            details.createdData?.type ||
            details.before?.type ||
            details.after?.type
        )?.toUpperCase();

        if (assetType && ENTITY_LABELS[assetType]) {
            return ENTITY_LABELS[assetType];
        }
    }

    return ENTITY_LABELS[entityUpper] || log.entity;
}
