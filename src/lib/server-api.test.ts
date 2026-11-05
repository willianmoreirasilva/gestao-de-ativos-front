import { beforeEach, describe, expect, it, vi } from "vitest";

const cookieStore = vi.hoisted(() => ({
    getAll: vi.fn(),
    get: vi.fn(),
}));
vi.mock("next/headers", () => ({ cookies: async () => cookieStore }));

import { getServerApi } from "./server-api";

describe("getServerApi (B6)", () => {
    beforeEach(() => {
        cookieStore.getAll.mockReturnValue([
            { name: "better-auth.session_token", value: "abc.def" },
        ]);
        cookieStore.get.mockImplementation((name: string) =>
            name === "better-auth.session_token"
                ? { name, value: "abc.def" }
                : undefined,
        );
    });

    it("repassa só o cookie de sessão, sem Authorization Bearer (o back não usa)", async () => {
        const api = await getServerApi();
        const common = api.defaults.headers.common as Record<string, unknown>;

        expect(common["Cookie"]).toBe("better-auth.session_token=abc.def");
        expect(common["Authorization"]).toBeUndefined();
    });
});
