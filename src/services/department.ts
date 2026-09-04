import { getServerApi } from "@/lib/server-api";
import { Department } from "@/types/department";

export type DepartmentResponse = {
    data: Department[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

export const departmentService = {
    getDepartments: async (
        page: number = 1,
        limit: number = 8,
        search?: string,
    ): Promise<DepartmentResponse> => {
        try {
            const api = await getServerApi();
            const params: Record<string, string | number> = {
                page: page < 1 ? 1 : page,
                limit,
            };

            if (search) {
                params.search = search;
            }

            // Certifique-se de incluir o prefixo /api se o seu baseURL não possuir
            const response = await api.get("/api/departments", { params });

            return {
                data: response.data.data ?? [],
                meta: response.data.meta ?? {
                    total: 0,
                    page,
                    limit,
                    totalPages: 0,
                },
            };
        } catch (error) {
            console.error("Erro ao buscar departamentos:", error);
            return {
                data: [],
                meta: {
                    total: 0,
                    page,
                    limit,
                    totalPages: 0,
                },
            };
        }
    },

    getDepartmentById: async (id: string) => {
        try {
            const api = await getServerApi();
            const response = await api.get(`/api/departments/${id}`);

            return {
                data: (response.data.data ?? response.data) as Department,
                error: null,
            };
        } catch (error: unknown) {
            const apiError = error as {
                response?: { data?: { error?: string; message?: string } };
            };

            const errorMessage =
                apiError.response?.data?.error ||
                apiError.response?.data?.message ||
                "Erro ao buscar departamento";

            return {
                data: null,
                error: errorMessage,
            };
        }
    },
};
