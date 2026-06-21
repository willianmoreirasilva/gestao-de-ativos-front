import { getServerApi } from "@/lib/server-api";
import { Location } from "@/types/location";

type LocationResponse = {
    total: number;
    data: Location[];
};

export const locationService = {
    getLocations: async (
        offset: number = 0,
        limit: number = 10,
        query?: string,
    ): Promise<LocationResponse> => {
        try {
            const api = await getServerApi();
            const params: Record<string, string | number> = { offset, limit };
            if (query) params.name = query; // Ou a chave de busca que seu backend espera (ex: search ou q)

            const response = await api.get("/api/locations", { params });
            return {
                total: response.data.total || 0,
                data: response.data.data,
            };
        } catch (error) {
            console.error("Erro ao buscar locais:", error);
            return { total: 0, data: [] as Location[] };
        }
    },

    getLocationById: async (id: string) => {
        try {
            const api = await getServerApi();
            const response = await api.get(`/api/locations/${id}`);
            return { error: null, data: response.data.data as Location };
        } catch (error) {
            console.error("Erro ao buscar locais:", error);
            return { error: "Erro ao buscar locais:" };
        }
    },
};
