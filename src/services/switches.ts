import { apiErrorMessage } from "@/lib/api-error";
import { getServerApi } from "@/lib/server-api";
import type { GetSwitchesParams, SwitchItem } from "@/types/switches";

export const switchService = {
    /**
     * Recupera todos os switches cadastrados (com paginação e filtros)
     */
    async getSwitches(params?: GetSwitchesParams) {
        try {
            const api = await getServerApi();
            const response = await api.get("/api/switches", {
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 8,
                    search: params?.search,
                },
            });

            return {
                data: response.data?.data as SwitchItem[],
                meta: response.data?.meta,
                error: null,
            };
        } catch (err) {
            console.error("Erro ao buscar switches:", err);
            return {
                data: [],
                meta: null,
                error: apiErrorMessage(
                    err,
                    "Falha ao carregar a lista de switches.",
                    "message",
                ),
            };
        }
    },

    /**
     * Busca um switch específico pelo ID
     */
    async getSwitchById(id: string) {
        try {
            const api = await getServerApi();
            const response = await api.get(`/api/switches/${id}`);
            return {
                data: response.data?.data as SwitchItem,
                error: null,
            };
        } catch (err) {
            console.error(`Erro ao buscar switch ${id}:`, err);
            return {
                data: null,
                error: apiErrorMessage(
                    err,
                    "Não foi possível localizar o switch solicitado.",
                    "message",
                ),
            };
        }
    },
};
