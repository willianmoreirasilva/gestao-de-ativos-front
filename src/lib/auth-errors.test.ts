import { describe, expect, it } from "vitest";

import { loginErrorMessage } from "./auth-errors";

describe("loginErrorMessage", () => {
    it("traduz o erro padrão de credenciais do Better Auth", () => {
        const msg = "E-mail ou senha incorretos.";
        expect(
            loginErrorMessage({
                code: "INVALID_EMAIL_OR_PASSWORD",
                message: "Invalid email or password",
                status: 401,
            }),
        ).toBe(msg);
        expect(
            loginErrorMessage({
                message: "Invalid email or password",
                status: 401,
            }),
        ).toBe(msg);
    });

    it("mantém a mensagem em português do back (limite de tentativas e conta desativada)", () => {
        const limite =
            "Muitas tentativas. Aguarde 30 segundos e tente de novo.";
        expect(
            loginErrorMessage({
                code: "TOO_MANY_REQUESTS",
                message: limite,
                status: 429,
            }),
        ).toBe(limite);
        expect(
            loginErrorMessage({
                message: "Conta desativada. Procure um administrador.",
                status: 403,
            }),
        ).toBe("Conta desativada. Procure um administrador.");
    });

    it("avisa quando o servidor não responde", () => {
        const msg =
            "Não foi possível conectar ao servidor. Tente novamente em instantes.";
        expect(
            loginErrorMessage({ message: "Failed to fetch", status: 0 }),
        ).toBe(msg);
        expect(
            loginErrorMessage({
                message: "Internal Server Error",
                status: 500,
            }),
        ).toBe(msg);
    });

    it("nunca devolve texto em inglês desconhecido", () => {
        expect(
            loginErrorMessage({ message: "Something odd", status: 400 }),
        ).toBe("Não foi possível entrar. Tente novamente.");
    });
});
