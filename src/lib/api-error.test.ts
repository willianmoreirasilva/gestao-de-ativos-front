import { AxiosError, type AxiosResponse } from "axios";
import { describe, expect, it } from "vitest";

import {
    apiErrorMessage,
    getApiErrorBody,
    getApiErrorStatus,
} from "./api-error";

function apiError(status: number, data: unknown) {
    const response = {
        status,
        data,
        statusText: "",
        headers: {},
        config: {},
    } as AxiosResponse;
    return new AxiosError(
        "Request failed",
        "ERR_BAD_REQUEST",
        undefined,
        {},
        response,
    );
}

// Servidor fora do ar: o axios rejeita sem `response`
const networkError = new AxiosError("Network Error", "ERR_NETWORK");

describe("getApiErrorStatus", () => {
    it("devolve o status da resposta", () => {
        expect(getApiErrorStatus(apiError(403, {}))).toBe(403);
    });

    it("devolve null sem resposta ou fora do axios", () => {
        expect(getApiErrorStatus(networkError)).toBeNull();
        expect(getApiErrorStatus(new Error("x"))).toBeNull();
        expect(getApiErrorStatus("x")).toBeNull();
    });
});

describe("getApiErrorBody", () => {
    it("lê message, error e fieldErrors de um erro de validação", () => {
        const body = getApiErrorBody(
            apiError(400, {
                message: "Dados inválidos",
                error: "Bad Request",
                fieldErrors: { patrimony: ["Patrimônio já cadastrado"] },
            }),
        );
        expect(body).toEqual({
            message: "Dados inválidos",
            error: "Bad Request",
            fieldErrors: { patrimony: ["Patrimônio já cadastrado"] },
        });
    });

    it("ignora campos com tipo inesperado", () => {
        const body = getApiErrorBody(
            apiError(500, {
                message: { nested: true },
                error: 42,
                fieldErrors: { a: ["ok"], b: "texto", c: [1] },
            }),
        );
        expect(body).toEqual({ fieldErrors: { a: ["ok"] } });
    });

    it("devolve vazio sem corpo, com corpo não-objeto ou fora do axios", () => {
        expect(getApiErrorBody(networkError)).toEqual({});
        expect(getApiErrorBody(apiError(500, "<html>"))).toEqual({});
        expect(getApiErrorBody(apiError(500, null))).toEqual({});
        expect(getApiErrorBody(new Error("x"))).toEqual({});
        expect(getApiErrorBody(undefined)).toEqual({});
    });
});

describe("apiErrorMessage", () => {
    const fallback = "Falha padrão";

    it("mostra a mensagem de validação da API", () => {
        const error = apiError(400, { message: "Patrimônio já cadastrado" });
        expect(apiErrorMessage(error, fallback)).toBe(
            "Patrimônio já cadastrado",
        );
    });

    it("mostra a mensagem do 403 enviada pela API", () => {
        const error = apiError(403, { error: "Sem permissão para esta ação" });
        expect(apiErrorMessage(error, fallback)).toBe(
            "Sem permissão para esta ação",
        );
    });

    it("usa o fallback com o servidor fora do ar", () => {
        expect(apiErrorMessage(networkError, fallback)).toBe(fallback);
    });

    it("usa o fallback em erro que não é do axios", () => {
        expect(apiErrorMessage(new Error("boom"), fallback)).toBe(fallback);
    });

    it("usa o fallback com corpo vazio ou string vazia", () => {
        expect(apiErrorMessage(apiError(500, {}), fallback)).toBe(fallback);
        expect(apiErrorMessage(apiError(500, { message: "" }), fallback)).toBe(
            fallback,
        );
    });

    it("padrão: message antes de error", () => {
        const error = apiError(400, { message: "M", error: "E" });
        expect(apiErrorMessage(error, fallback)).toBe("M");
    });

    it("respeita a ordem e a lista de campos pedida", () => {
        const error = apiError(400, { message: "M", error: "E" });
        expect(apiErrorMessage(error, fallback, "error", "message")).toBe("E");
        expect(apiErrorMessage(error, fallback, "error")).toBe("E");
        // só `message` pedido: um corpo só com `error` cai no fallback
        expect(
            apiErrorMessage(apiError(400, { error: "E" }), fallback, "message"),
        ).toBe(fallback);
    });
});
