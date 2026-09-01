import { getServerApi } from "@/lib/server-api";
import {
    AccessPointItem,
    AccessPointsResponse,
    GetAccessPointsParams,
} from "@/types/access-points";

export const accessPointService = {
    async getAccessPoints(
        params?: GetAccessPointsParams,
    ): Promise<AccessPointsResponse> {
        try {
            const api = await getServerApi();
            const response = await api.get<AccessPointsResponse>(
                "/api/access-points",
                { params },
            );
            return response.data;
        } catch (error) {
            console.error("❌ [getAccessPoints Error]:", error);
            return {
                data: [],
                meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
            };
        }
    },

    async getAccessPointById(
        id: string,
    ): Promise<{ data?: AccessPointItem; error?: string }> {
        try {
            const api = await getServerApi();
            const response = await api.get<{ data: AccessPointItem }>(
                `/api/access-points/${id}`,
            );
            return { data: response.data.data };
        } catch (error: any) {
            console.error("❌ [getAccessPointById Error]:", error);
            return {
                error:
                    error.response?.data?.message ||
                    "Erro ao carregar os detalhes do Access Point.",
            };
        }
    },
};
