import { getServerApi } from "@/lib/server-api";
import { ApiResponse } from "@/types/api";
import {
    ApiMeta,
    ApiResponseWithMeta,
    AssetFilters,
    AssetItem,
} from "@/types/assets";

interface AssetsListResult<T> {
    data: T | null;
    meta: ApiMeta | null;
    error: string | null;
}

/**
 * Busca a listagem de ativos filtrada com base nos parâmetros informados
 */
export async function getAssets(
    filters: AssetFilters = {},
): Promise<AssetsListResult<AssetItem[]>> {
    try {
        const api = await getServerApi();
        const searchParams = new URLSearchParams();

        if (filters.type) searchParams.append("type", filters.type);
        if (filters.departmentId)
            searchParams.append("departmentId", filters.departmentId);
        if (filters.locationId)
            searchParams.append("locationId", filters.locationId);
        if (filters.networkId)
            searchParams.append("networkId", filters.networkId);
        if (filters.connectedToSwitchId)
            searchParams.append(
                "connectedToSwitchId",
                filters.connectedToSwitchId,
            );

        // Filtros de controle e busca global
        if (filters.search) searchParams.append("search", filters.search);
        if (filters.hasIp) searchParams.append("hasIp", filters.hasIp);
        if (filters.page) searchParams.append("page", String(filters.page));
        if (filters.limit) searchParams.append("limit", String(filters.limit));

        const url = `/api/assets?${searchParams.toString()}`;
        const response = await api.get<ApiResponseWithMeta<AssetItem[]>>(url);

        return {
            data: response.data.data,
            meta: response.data.meta,
            error: null,
        };
    } catch (error: unknown) {
        console.error("❌ Erro ao buscar ativos:", error);
        const apiError = error as {
            response?: { status?: number; data?: { error?: string } };
        };

        return {
            data: null,
            meta: null,
            error:
                apiError.response?.data?.error ||
                "Não foi possível carregar a lista de ativos.",
        };
    }
}

/**
 * Busca os detalhes de um ativo específico pelo ID
 */
export async function getAssetById(
    id: string,
): Promise<ApiResponse<AssetItem>> {
    try {
        const api = await getServerApi();
        const response = await api.get(`/api/assets/${id}`);
        return { data: response.data.data, error: null };
    } catch (error) {
        console.error(`❌ Erro ao buscar ativo ${id}:`, error);
        return {
            data: null,
            error: "Erro ao buscar ativo.",
        };
    }
}
