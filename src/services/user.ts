import { isAxiosError } from "axios";

import { getServerApi } from "@/lib/server-api";
import type {
    InvitationDetails,
    MyProfile,
    ServiceResult,
    UsersListResponse,
} from "@/types/user";

type ListUsersParams = {
    page: number;
    limit: number;
    search?: string;
};

// Converte erros da API em mensagens adequadas ao usuário
export function extractApiError(
    error: unknown,
    fallback: string,
): { message: string; status: number | null } {
    if (!isAxiosError(error)) {
        return { message: fallback, status: null };
    }

    const status = error.response?.status ?? null;

    if (!error.response) {
        return {
            message:
                "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
            status,
        };
    }

    if (status === 401) {
        return {
            message: "Sua sessão expirou. Faça login novamente.",
            status,
        };
    }

    const data: unknown = error.response.data;
    const apiMessage =
        data && typeof data === "object"
            ? ("error" in data && typeof data.error === "string"
                  ? data.error
                  : null) ||
              ("message" in data && typeof data.message === "string"
                  ? data.message
                  : null)
            : null;

    if (status === 403) {
        return {
            message:
                apiMessage ||
                "Você não tem permissão para realizar esta operação.",
            status,
        };
    }

    return { message: apiMessage || fallback, status };
}

export const userService = {
    listUsers: async ({
        page,
        limit,
        search,
    }: ListUsersParams): Promise<ServiceResult<UsersListResponse>> => {
        try {
            const api = await getServerApi();
            const params: Record<string, string | number> = { page, limit };
            if (search) params.search = search;

            const response = await api.get<UsersListResponse>("/api/users", {
                params,
            });

            return {
                data: response.data,
                error: null,
                status: response.status,
            };
        } catch (error) {
            const { message, status } = extractApiError(
                error,
                "Não foi possível carregar os usuários.",
            );
            return { data: null, error: message, status };
        }
    },

    getMyProfile: async (): Promise<ServiceResult<MyProfile>> => {
        try {
            const api = await getServerApi();
            const response = await api.get<MyProfile>("/api/users/me");
            return {
                data: response.data,
                error: null,
                status: response.status,
            };
        } catch (error) {
            const { message, status } = extractApiError(
                error,
                "Não foi possível carregar o seu perfil.",
            );
            return { data: null, error: message, status };
        }
    },

    // Rota pública: o token recebido por e-mail é a credencial
    getInvitation: async (
        token: string,
    ): Promise<ServiceResult<InvitationDetails>> => {
        try {
            const api = await getServerApi();
            const response = await api.get<InvitationDetails>(
                "/api/users/invitations/validate",
                { params: { token } },
            );
            return {
                data: response.data,
                error: null,
                status: response.status,
            };
        } catch (error) {
            const { message, status } = extractApiError(
                error,
                "Não foi possível validar o convite.",
            );
            return { data: null, error: message, status };
        }
    },
};
