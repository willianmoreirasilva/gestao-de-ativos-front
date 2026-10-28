import { AxiosError } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

const get = vi.fn();
vi.mock("@/lib/server-api", () => ({
    getServerApi: async () => ({ get }),
}));

import { fetchAuditLogs } from "./audit.service";

const page = { page: 1, limit: 8 };

function httpError(status: number, data: unknown) {
    return new AxiosError("falhou", undefined, undefined, undefined, {
        status,
        data,
    } as never);
}

beforeEach(() => {
    get.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("fetchAuditLogs (M2)", () => {
    it("devolve os dados em caso de sucesso, sempre com o prefixo /api", async () => {
        const body = {
            data: [],
            meta: { total: 0, page: 1, limit: 8, totalPages: 1 },
        };
        get.mockResolvedValue({ status: 200, data: body });

        const result = await fetchAuditLogs(page);

        expect(get).toHaveBeenCalledWith("/api/audit-logs?page=1&limit=8");
        expect(result).toEqual({ data: body, error: null, status: 200 });
    });

    it("usa /api/audit-logs mesmo sem filtros", async () => {
        get.mockResolvedValue({ status: 200, data: {} });
        await fetchAuditLogs({});
        expect(get).toHaveBeenCalledWith("/api/audit-logs");
    });

    it("403 não vira lista vazia: mantém o status", async () => {
        get.mockRejectedValue(httpError(403, { error: "Acesso negado" }));

        const result = await fetchAuditLogs(page);

        expect(result.data).toBeNull();
        expect(result.status).toBe(403);
    });

    it("500 devolve uma mensagem própria, não o texto técnico da API", async () => {
        get.mockRejectedValue(
            httpError(500, { error: "Internal Server Error" }),
        );

        const result = await fetchAuditLogs(page);

        expect(result.data).toBeNull();
        expect(result.status).toBe(500);
        expect(result.error).toMatch(/servidor encontrou um erro/);
        expect(result.error).not.toMatch(/Internal Server Error/);
    });

    it("servidor fora do ar (sem resposta) devolve erro e status null", async () => {
        get.mockRejectedValue(new AxiosError("connect ECONNREFUSED"));

        const result = await fetchAuditLogs(page);

        expect(result.data).toBeNull();
        expect(result.status).toBeNull();
        expect(result.error).toMatch(/conectar ao servidor/);
    });
});
