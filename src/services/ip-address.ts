import { getServerApi } from "@/lib/server-api";
import {
    FindAvailableIpsResponse,
    IpAddress,
    IpStatusStat,
    OverviewStatsResponse,
    PaginatedMeta,
    VerifyIpResponse,
} from "@/types/ip-address";

export interface IpAddressFilters {
    networkId?: string;
    status?: "AVAILABLE" | "IN_USE" | "RESERVED" | "ALL";
    search?: string;
    offset?: number;
    limit?: number;
}

export const ipAddressService = {
    // 1. GET /api/ip-addresses
    async getIpAddresses(filters: IpAddressFilters) {
        const api = await getServerApi();
        const searchParams = new URLSearchParams();

        if (filters.networkId)
            searchParams.append("networkId", filters.networkId);
        if (filters.status && filters.status !== "ALL")
            searchParams.append("status", filters.status);
        if (filters.search) searchParams.append("search", filters.search);
        if (filters.offset !== undefined)
            searchParams.append("offset", String(filters.offset));
        if (filters.limit !== undefined)
            searchParams.append("limit", String(filters.limit));

        try {
            const response = await api.get(
                `/api/ip-addresses?${searchParams.toString()}`,
            );
            return {
                data: response.data.data as IpAddress[],
                meta: response.data.meta as PaginatedMeta,
                error: null,
            };
        } catch (error: any) {
            console.error("Erro ao buscar IP Addresses:", error);
            return {
                data: [],
                meta: { total: 0, offset: 0, limit: 50 },
                error:
                    error.response?.data?.error ||
                    "Erro ao carregar endereços IP",
            };
        }
    },

    // 2. GET /api/ip-addresses/stats
    async getStats() {
        const api = await getServerApi();
        try {
            const response = await api.get("/api/ip-addresses/stats");
            return { data: response.data.data as IpStatusStat[], error: null };
        } catch (error: any) {
            console.error("Erro ao buscar estatísticas de IPs:", error);
            return {
                data: [],
                error:
                    error.response?.data?.error ||
                    "Erro ao carregar estatísticas",
            };
        }
    },

    // 3. GET /api/ip-addresses/verify
    async verifyIp(address: string, expectedType: string) {
        const api = await getServerApi();
        try {
            const response = await api.get(
                `/api/ip-addresses/verify?address=${address}&expectedType=${expectedType}`,
            );
            return { data: response.data as VerifyIpResponse, error: null };
        } catch (error: any) {
            return {
                data: null,
                error:
                    error.response?.data?.error || "Falha na verificação do IP",
            };
        }
    },

    // 4. GET /api/ip-addresses/overview-stats

    async getOverviewStats(networkId?: string) {
        const api = await getServerApi();
        const query =
            networkId && networkId !== "ALL" ? `?networkId=${networkId}` : "";
        try {
            const response = await api.get(
                `/api/ip-addresses/overview-stats${query}`,
            );

            return {
                data: response.data.data as OverviewStatsResponse,
                error: null,
            };
        } catch (error: any) {
            console.error("Erro ao carregar overview stats:", error);
            return {
                data: null,
                error:
                    error.response?.data?.error ||
                    "Erro ao carregar resumo de IPs",
            };
        }
    },
    // 5. GET /api/ip-addresses/available
    async getAvailableIps(networkId?: string, page = 1, limit = 10) {
        const api = await getServerApi();
        const searchParams = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        });
        if (networkId && networkId !== "ALL")
            searchParams.append("networkId", networkId);

        try {
            const response = await api.get(
                `/api/ip-addresses/available?${searchParams.toString()}`,
            );
            return {
                data: response.data.data as IpAddress[],
                meta: {
                    total: response.data.total,
                    page: response.data.page,
                    limit: response.data.limit,
                    totalPages: response.data.totalPages,
                } as PaginatedMeta,
                error: null,
            };
        } catch (error: any) {
            return {
                data: [],
                meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
                error: error.response?.data?.error,
            };
        }
    },

    // 6. GET /api/ip-addresses/recent
    async getRecentIps(limit = 10) {
        const api = await getServerApi();
        try {
            const response = await api.get(
                `/api/ip-addresses/recent?limit=${limit}`,
            );
            return { data: response.data.data as IpAddress[], error: null };
        } catch (error: any) {
            return {
                data: [],
                error:
                    error.response?.data?.error ||
                    "Erro ao carregar IPs recentes",
            };
        }
    },

    // 7. POST /api/ip-addresses/find-available
    async findAvailableIps(networkId: string, quantity: number) {
        const api = await getServerApi();
        try {
            const response = await api.post(
                "/api/ip-addresses/find-available",
                { networkId, quantity },
            );
            return {
                data: response.data.data as FindAvailableIpsResponse,
                error: null,
            };
        } catch (error: any) {
            return {
                data: null,
                error:
                    error.response?.data?.error ||
                    "Erro ao calcular IPs disponíveis",
            };
        }
    },
};
