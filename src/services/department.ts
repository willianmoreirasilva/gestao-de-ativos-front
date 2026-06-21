import { getServerApi } from "@/lib/server-api";
import { Department } from "@/types/department";

type DepartmentResponse = {
    total: number;
    data: Department[];
};

export const departmentService = {
    getDepartments: async (
        offset: number = 0,
        limit: number = 10,
        query?: string,
    ): Promise<DepartmentResponse> => {
        try {
            const api = await getServerApi();
            const params: Record<string, string | number> = { offset, limit };

            if (query) params.name = query; // Ou a chave de busca que seu backend espera (ex: search ou q)
            const response = await api.get("/api/departments", { params });
            return {
                total: response.data.total || 0,
                data: response.data.data,
            };
        } catch (error) {
            console.error("Erro ao buscar Departamento:", error);
            return { total: 0, data: [] as Department[] };
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
        } catch (error: unknown) {
            // Se a API retornar um erro formatado, tentamos pegar a mensagem dela
            const apiError = error as {
                response?: { data?: { error?: string } };
            };

            const errorMessage =
                apiError.response?.data?.error || "Erro ao buscar departamento";
            return {
                data: null,
                error: errorMessage,
            };
        }
    },
};
