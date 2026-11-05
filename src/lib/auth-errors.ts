type AuthClientError = {
    code?: string;
    message?: string;
    status?: number;
};

const CREDENTIALS_MESSAGE = "E-mail ou senha incorretos.";

// Códigos do Better Auth que o login pode devolver (a mensagem deles vem em inglês)
const LOGIN_ERROR_MESSAGES: Record<string, string> = {
    INVALID_EMAIL_OR_PASSWORD: CREDENTIALS_MESSAGE,
    INVALID_PASSWORD: CREDENTIALS_MESSAGE,
    INVALID_EMAIL: CREDENTIALS_MESSAGE,
    USER_NOT_FOUND: CREDENTIALS_MESSAGE,
};

/**
 * Mensagem do login em português. As respostas 429 (limite de tentativas) e
 * 403 (conta desativada) já vêm em português do back e são mantidas; o resto
 * nunca mostra o texto cru do Better Auth.
 */
export function loginErrorMessage(error: AuthClientError): string {
    if (error.code && LOGIN_ERROR_MESSAGES[error.code]) {
        return LOGIN_ERROR_MESSAGES[error.code];
    }
    if (error.status === 401) return CREDENTIALS_MESSAGE;
    if ((error.status === 429 || error.status === 403) && error.message) {
        return error.message;
    }
    if (!error.status || error.status >= 500) {
        return "Não foi possível conectar ao servidor. Tente novamente em instantes.";
    }
    return "Não foi possível entrar. Tente novamente.";
}
