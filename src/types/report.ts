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

export interface SingleFilter {
    field: string;
    operator: FilterOperator;
    value?: any;
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

export interface AssetReportData {
    [key: string]: any;
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
