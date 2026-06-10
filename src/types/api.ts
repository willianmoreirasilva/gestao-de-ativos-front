// Resposta padrão da API para um objeto único
export type ApiResponse<T> = {
    error: string | null;
    data: T | null;
};

// Resposta padrão da API para listagens
export type ApiListResponse<T> = {
    error: string | null;
    data: T[];
};

// Tipo para o estado das Server Actions no Front
export type ActionState = {
    error: string | null;
    success?: boolean;
} | null;
