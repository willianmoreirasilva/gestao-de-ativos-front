export type FilterOperator =
    | "eq"
    | "neq"
    | "contains"
    | "startsWith"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "in"
    | "isNull"
    | "isNotNull";

// Valor de um filtro: texto, número, booleano ou lista (operador "in")
export type FilterValue =
    | string
    | number
    | boolean
    | null
    | Array<string | number>;

export interface SingleFilter {
    field: string;
    operator: FilterOperator;
    value?: FilterValue;
}

export interface ReportQueryPayload {
    filters: SingleFilter[];
    groupBy?: "none" | "department" | "location" | "network" | "type";
    columns: string[];
    orderBy?: {
        field: string;
        direction: "asc" | "desc";
    };
    page?: number;
    limit?: number;
    // Com o filtro de switch: inclui os ativos de todos os níveis abaixo dele
    includeCascade?: boolean;
}

// Linha do relatório. A API devolve só as colunas pedidas e os detalhes do tipo do ativo
export interface AssetReportData {
    id: string;
    type: string;
    patrimony?: string | null;
    name?: string | null;
    ipAddress?: string | null;
    ip?:
        | {
              address?: string | null;
              network?: { vlanTag?: number | null } | null;
          }
        | string
        | null;
    department?: { name?: string | null } | null;
    location?: { name?: string | null } | null;
    computer?: { hostname?: string | null } | null;
    printer?: { hostname?: string | null } | null;
    camera?: { hostname?: string | null } | null;
    switch?: { hostname?: string | null } | null;
    phone?: { phoneNumber?: string | null } | null;
    accessPoint?: { ssid?: string | null } | null;
    // Só com o filtro de switch em cascata: 1 = ligado direto
    cascadeLevel?: number;
    cascadePath?: string;
}

export interface ReportCascadeInfo {
    maxDepth: number;
    truncated: boolean;
}

export interface AssetReportResponse {
    data: AssetReportData[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    summary: {
        totalAssets: number;
        withIp: number;
        withoutIp: number;
        departmentsCount: number;
    };
    cascade?: ReportCascadeInfo;
    error: string | null;
}
