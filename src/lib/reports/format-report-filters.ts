import { ReportQueryPayload, SingleFilter } from "@/types/report";

interface UiFilterState {
    search?: string;
    selectedTypes?: string[];
    hasIp?: "ALL" | "true" | "false";
    departmentId?: string | null;
    locationId?: string | null;
    networkId?: string | null;
    processorId?: string | null;
    osId?: string | null;
    hostname?: string;
    columns?: string[];
    page?: number;
    limit?: number;
    orderByField?: string;
    orderByDirection?: "asc" | "desc";
}

export function buildReportPayload(state: UiFilterState): ReportQueryPayload {
    const filters: SingleFilter[] = [];

    // Busca Geral por Patrimônio
    if (state.search && state.search.trim() !== "") {
        filters.push({
            field: "patrimony",
            operator: "contains",
            value: state.search.trim(),
        });
    }

    // Tipos Múltiplos
    if (state.selectedTypes && state.selectedTypes.length > 0) {
        filters.push({
            field: "type",
            operator: "in",
            value: state.selectedTypes,
        });
    }

    // Departamento
    if (state.departmentId) {
        filters.push({
            field: "departmentId",
            operator: "eq",
            value: state.departmentId,
        });
    }

    // Localização / Unidade
    if (state.locationId) {
        filters.push({
            field: "locationId",
            operator: "eq",
            value: state.locationId,
        });
    }

    // Presença de IP
    if (state.hasIp === "true") {
        filters.push({
            field: "hasIp",
            operator: "eq",
            value: true,
        });
    } else if (state.hasIp === "false") {
        filters.push({
            field: "hasIp",
            operator: "eq",
            value: false,
        });
    }

    // Escopo de Rede (VLAN)
    if (state.networkId) {
        filters.push({
            field: "networkId",
            operator: "eq",
            value: state.networkId,
        });
    }

    // Filtros Específicos de Computador
    if (state.processorId) {
        filters.push({
            field: "computer.processorId",
            operator: "eq",
            value: state.processorId,
        });
    }

    if (state.osId) {
        filters.push({
            field: "computer.osId",
            operator: "eq",
            value: state.osId,
        });
    }

    if (state.hostname) {
        filters.push({
            field: "computer.hostname",
            operator: "contains",
            value: state.hostname,
        });
    }

    // Colunas padrão de fallback caso a lista esteja vazia
    const defaultColumns = [
        "patrimony",
        "type",
        "department.name",
        "location.name",
        "ip.address",
        "createdAt",
    ];

    return {
        filters,
        groupBy: "none",
        columns:
            state.columns && state.columns.length > 0
                ? state.columns
                : defaultColumns,
        orderBy: {
            field: state.orderByField || "createdAt",
            direction: state.orderByDirection || "desc",
        },
        page: state.page || 1,
        limit: state.limit || 20,
    };
}
