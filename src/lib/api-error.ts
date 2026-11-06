import { isAxiosError } from "axios";

type ApiErrorKey = "message" | "error";

export type ApiErrorBody = {
    message?: string;
    error?: string;
    fieldErrors?: Record<string, string[]>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Status HTTP da resposta de erro, ou null (sem resposta ou erro que não é do axios). */
export function getApiErrorStatus(error: unknown): number | null {
    return isAxiosError(error) ? (error.response?.status ?? null) : null;
}

/** true se a resposta de erro trouxe algum corpo (mesmo que não seja JSON). */
export function hasApiErrorData(error: unknown): boolean {
    return isAxiosError(error) && Boolean(error.response?.data);
}

/** O que registrar no log: corpo da resposta da API, ou a mensagem do erro. */
export function describeApiError(error: unknown): unknown {
    if (isAxiosError(error)) return error.response?.data || error.message;
    return error instanceof Error ? error.message : error;
}

/**
 * Corpo de erro devolvido pela API, só com os campos conhecidos e já
 * validados (`message`, `error`, `fieldErrors`). Vazio se não houver corpo.
 */
export function getApiErrorBody(error: unknown): ApiErrorBody {
    if (!isAxiosError(error)) return {};

    const data: unknown = error.response?.data;
    if (!isRecord(data)) return {};

    const body: ApiErrorBody = {};
    if (typeof data.message === "string") body.message = data.message;
    if (typeof data.error === "string") body.error = data.error;

    if (isRecord(data.fieldErrors)) {
        const fieldErrors: Record<string, string[]> = {};
        for (const [field, messages] of Object.entries(data.fieldErrors)) {
            if (
                Array.isArray(messages) &&
                messages.every((m) => typeof m === "string")
            ) {
                fieldErrors[field] = messages;
            }
        }
        body.fieldErrors = fieldErrors;
    }

    return body;
}

/**
 * Mensagem da API para exibir ao usuário. `keys` define quais campos do corpo
 * valem e em que ordem (padrão: `message` e depois `error`); se nenhum vier
 * preenchido, devolve `fallback`. Cada chamador mantém a precedência que já
 * tinha, então o texto mostrado não muda.
 */
export function apiErrorMessage(
    error: unknown,
    fallback: string,
    ...keys: ApiErrorKey[]
): string {
    const body = getApiErrorBody(error);
    for (const key of keys.length > 0
        ? keys
        : (["message", "error"] as const)) {
        const value = body[key];
        if (value) return value;
    }
    return fallback;
}
