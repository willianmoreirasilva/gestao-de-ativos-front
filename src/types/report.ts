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
    error: string | null;
}
