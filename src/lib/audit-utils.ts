import { ENTITY_LABELS } from "@/types/audit";

import { isRecord } from "./utils";

export type LogDetails = Record<string, unknown>;

export interface AuditEntityItem {
    entity: string;
    details?: LogDetails | null;
}

function nestedType(value: unknown): unknown {
    return isRecord(value) ? value.type : undefined;
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

        const assetType = [
            details.type,
            nestedType(details.createdData),
            nestedType(details.before),
            nestedType(details.after),
        ]
            .find((value) => typeof value === "string" && value !== "")
            ?.toString()
            .toUpperCase();

        if (assetType && ENTITY_LABELS[assetType]) {
            return ENTITY_LABELS[assetType];
        }
    }

    return ENTITY_LABELS[entityUpper] || log.entity;
}
