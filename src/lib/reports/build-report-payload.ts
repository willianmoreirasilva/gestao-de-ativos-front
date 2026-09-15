import { ReportQueryPayload, SingleFilter } from "@/types/report";

interface FilterStateParams {
    search: string;
    ipStatus: "ALL" | "true" | "false";
    selectedTypes: string[];
    departmentId: string | null;
    locationId: string | null;
    networkId: string | null;
    selectedOsId: string | null;
    selectedProcessorId: string | null;
    selectedRam: string | null;
    selectedSwitchId: string | null;
    page?: number;
    limit?: number;
}

export function buildReportPayload(
    state: FilterStateParams,
): ReportQueryPayload {
    const filters: SingleFilter[] = [];

    // 1. Busca textual por Patrimônio
    if (state.search.trim()) {
        filters.push({
            field: "patrimony",
            operator: "contains",
            value: state.search.trim(),
        });
    }

    // 2. Presença / Ausência de IP
    if (state.ipStatus === "true") {
        filters.push({ field: "hasIp", operator: "eq", value: true });
    } else if (state.ipStatus === "false") {
        filters.push({ field: "hasIp", operator: "eq", value: false });
    }

    // 3. Tipos Selecionados
    if (state.selectedTypes.length > 0) {
        filters.push({
            field: "type",
            operator: "in",
            value: state.selectedTypes,
        });
    }

    // 4. Relacionamentos Diretos
    if (state.departmentId) {
        filters.push({
            field: "departmentId",
            operator: "eq",
            value: state.departmentId,
        });
    }

    if (state.locationId) {
        filters.push({
            field: "locationId",
            operator: "eq",
            value: state.locationId,
        });
    }

    if (state.networkId) {
        filters.push({
            field: "networkId",
            operator: "eq",
            value: state.networkId,
        });
    }

    if (state.selectedSwitchId) {
        filters.push({
            field: "connectedToSwitchId",
            operator: "eq",
            value: state.selectedSwitchId,
        });
    }

    // 5. Especialização de Computador
    if (state.selectedOsId) {
        filters.push({
            field: "computer.osId",
            operator: "eq",
            value: state.selectedOsId,
        });
    }

    if (state.selectedProcessorId) {
        filters.push({
            field: "computer.processorId",
            operator: "eq",
            value: state.selectedProcessorId,
        });
    }

    if (state.selectedRam) {
        filters.push({
            field: "computer.ramSize",
            operator: "eq",
            value: state.selectedRam,
        });
    }

    return {
        filters,
        groupBy: "none",
        columns: [
            "patrimony",
            "type",
            "department",
            "location",
            "ip",
            "computer",
        ],
        orderBy: {
            field: "createdAt",
            direction: "desc",
        },
        page: state.page || 1,
        limit: state.limit || 20,
    };
}
