import { getServerApi } from "@/lib/server-api";
import { ApiResponse } from "@/types/api";

// Tipagem espelhada direto do seu Scalar API
export type UserSession = {
    id: string;
    name: string;
    email: string;
    image: string | null;
    emailVerified: boolean;
    role: "ADMIN" | "USER"; // Sua propriedade customizada do banco
};

export type SessionResponse = {
    user: UserSession;
    data?: any;
};

export const authService = {
    getMe: async (): Promise<ApiResponse<SessionResponse>> => {
        try {
            const api = await getServerApi();
            const response = await api.get("/api/auth/account-info");

            // 🔥 O LOG COMPLEMENTAR QUE VAI MATAR A CHARADA 🔥
            console.log(
                "👀 O QUE O ACCOUNT-INFO RETORNOU DE FATO:",
                response.data,
            );

            if (!response.data) {
                return {
                    error: "Usuário não encontrado na sessão",
                    data: null,
                };
            }

            // Vamos ajustar a leitura para aceitar se o user vier direto na raiz ou dentro de .user
            const userData = response.data.user || response.data;

            if (!userData || (!userData.email && !userData.id)) {
                console.log(
                    "❌ Validação falhou: objeto user ou id não encontrados no retorno.",
                );
                return { error: "Formato de usuário inválido", data: null };
            }

            const userWithRole = {
                ...userData,
                role: userData.role || response.data.data?.role || "USER",
            };

            return {
                error: null,
                data: {
                    user: userWithRole,
                    data: response.data.data || null,
                },
            };
        } catch (error: any) {
            console.error(
                "❌ Erro capturado no catch do getMe:",
                error.message,
            );
            return { error: "Sessão expirada ou inválida", data: null };
        }
    },
};
