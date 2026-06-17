import { getServerApi } from "@/lib/server-api";

export const departmentService = {
    getAllDepartments: async () => {
        try {
            const api = await getServerApi();
            const response = await api.get("/api/departments");
            return response.data;
        } catch (error) {
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
