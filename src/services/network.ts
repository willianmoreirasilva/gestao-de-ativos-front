import { getServerApi } from "@/lib/server-api";
import { Network } from "@/types/network";



export interface NetworkResponse {
    data: Network[];
    meta: {
        total: number;
        offset: number;
        limit: number;
    };
    error: string | null;
}

export interface SingleNetworkResponse {
    data: Network | null;
    error: string | null;
}

// Filtros aceitos pela listagem principal
export interface NetworkFilters {
    search?: string; // Usado para filtrar pelo networkAddress (ex: "192.168")
    vlanTag?: string | null;
    type?: string | null;
}

export const networkService = {
    /**
     * Busca todas as redes aplicando filtros opcionais enviando-os como Query Params
     */
    async getNetworks(filters?: NetworkFilters): Promise<NetworkResponse> {
        const api = await getServerApi();
        const searchParams = new URLSearchParams();

        // Estrutura os parâmetros apenas se eles existirem
        if (filters?.search) searchParams.append("search", filters.search);
        if (filters?.vlanTag) searchParams.append("vlanTag", filters.vlanTag);
        if (filters?.type && filters.type !== "ALL") searchParams.append("type", filters.type);

        try {
            // Repare na URL montada dinamicamente: /api/networks?search=...&vlanTag=...
            const response = await api.get(`/api/networks?${searchParams.toString()}`);
            
            return {
                data: response.data.data || [],
                meta: response.data.meta || { total: 0, offset: 1, limit: 10 },
                error: null
            };
        } catch (error: any) {
            console.error("Erro no service getNetworks:", error);
            return {
                data: [],
                meta: { total: 0, offset: 1, limit: 10 },
                error: error.response?.data?.error || "Falha ao carregar redes."
            };
        }
    },

    /**
     * Busca uma única rede por ID para a página de edição
     */
    async getNetworkById(id: string): Promise<SingleNetworkResponse> {
        const api = await getServerApi();
        try {
            const response = await api.get(`/api/networks/${id}`);
            return {
                data: response.data.data || response.data,
                error: null
            };
        } catch (error: any) {
            console.error(`Erro no service getNetworkById para o ID ${id}:`, error);
            return {
                data: null,
                error: error.response?.data?.error || "Rede não encontrada."
            };
        }
    }
};