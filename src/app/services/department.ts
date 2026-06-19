import { getServerApi } from "@/lib/server-api";

export const departmentService = {
    getDepartments: async (
        offset: number = 0,
        limit: number = 10,
        name?: string,
    ) => {
        try {
            const api = await getServerApi();
            const params: Record<string, string | number | undefined> = {
                offset,
                limit,
                name,
            };
            const response = await api.get("/api/departments", { params });
            return response.data;
        } catch (error: any) {
            return { error: "Erro ao buscar departamentos", data: null };
        }
    },

    getDepartmentById: async (id: string) => {
        try {
            const api = await getServerApi();
            const response = await api.get(`/api/departments/${id}`);
            return {
                data: response.data.data, // Pegamos o objeto de dentro do retorno da API
                error: null,
            };
        } catch (error: any) {
            // Se a API retornar um erro formatado, tentamos pegar a mensagem dela
            const errorMessage =
                error.response?.data?.error || "Erro ao buscar departamento";
            return {
                data: null,
                error: errorMessage,
            };
        }
    },
};
