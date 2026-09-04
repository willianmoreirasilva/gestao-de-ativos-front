import { getServerApi } from "@/lib/server-api";
import { Location } from "@/types/location";

type LocationResponse = {
    data: Location[];
    total: number;
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

export const locationService = {
    getLocations: async (
        page: number = 1,
        limit: number = 8,
        query?: string,
    ): Promise<LocationResponse> => {
        try {
            const api = await getServerApi();

            const params: Record<string, string | number> = {
                page: page < 1 ? 1 : page,
                limit,
            };
            // 💡 O backend espera 'search', não 'name' nem 'q'
            if (query && query.trim() !== "") {
                params.search = query.trim();
            }

            const response = await api.get("/api/locations", { params });

            return {
                data: response.data.data ?? [],
                total: response.data.meta?.total ?? response.data.total ?? 0,
                meta: response.data.meta,
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
            console.error("Erro ao buscar local:", error);
            return { error: "Erro ao buscar local", data: null };
        }
    },
};
