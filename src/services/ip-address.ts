import { getServerApi } from "@/lib/server-api";
import { IpAddress } from "@/types/ip-address";



export interface IpAddressFilters {
    networkId?: string;
    status?: "AVAILABLE" | "IN_USE" | "RESERVED" | "ALL";
    search?: string;
    offset?: number;
    limit?: number;
}

export const ipAddressService = {
    async getIpAddresses(filters: IpAddressFilters) {
        const api = await getServerApi();
        const searchParams = new URLSearchParams();

        if (filters.networkId) searchParams.append("networkId", filters.networkId);
        if (filters.status && filters.status !== "ALL") searchParams.append("status", filters.status);
        if (filters.search) searchParams.append("search", filters.search);
        if (filters.offset !== undefined) searchParams.append("offset", String(filters.offset));
        if (filters.limit !== undefined) searchParams.append("limit", String(filters.limit));

        try {
            const response = await api.get(`/api/ip-addresses?${searchParams.toString()}`);
            return {
                data: response.data.data as IpAddress[],
                meta: response.data.meta,
                error: null,
            };
        } catch (error: any) {
            console.error("Erro ao buscar IP Addresses:", error);
            return {
                data: [],
                meta: { total: 0, offset: 0, limit: 50 },
                error: error.response?.data?.error || "Erro ao carregar endereços IP",
            };
        }
    }
};