import { getServerApi } from "@/lib/server-api";

export interface OptionItem {
    id: string;
    name: string;
}

export interface OptionsResponse {
    data: OptionItem[];
}

// Catálogos dos formulários de computador (leitura no servidor).
// Quem chama decide o que fazer em caso de falha (lança o erro do axios).
export const optionsService = {
    async getProcessors(): Promise<OptionsResponse> {
        const api = await getServerApi();
        const response = await api.get("/api/options/processors");
        return response.data;
    },

    async getOperatingSystems(): Promise<OptionsResponse> {
        const api = await getServerApi();
        const response = await api.get("/api/options/operating-systems");
        return response.data;
    },

    async getDisks(): Promise<OptionsResponse> {
        const api = await getServerApi();
        const response = await api.get("/api/options/disks");
        return response.data;
    },
};
