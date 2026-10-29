import { describe, expect, it } from "vitest";

import { findSessionCookie } from "./session-cookie";

const reader = (jar: Record<string, string>) => ({
    get: (name: string) => (name in jar ? { value: jar[name] } : undefined),
});

describe("findSessionCookie", () => {
    it("reconhece o nome sem prefixo (http)", () => {
        expect(
            findSessionCookie(reader({ "better-auth.session_token": "abc" })),
        ).toEqual({ name: "better-auth.session_token", value: "abc" });
    });

    it("reconhece o nome com __Secure- (https)", () => {
        expect(
            findSessionCookie(
                reader({ "__Secure-better-auth.session_token": "xyz" }),
            ),
        ).toEqual({
            name: "__Secure-better-auth.session_token",
            value: "xyz",
        });
    });

    it("devolve null sem cookie de sessão ou com valor vazio", () => {
        expect(findSessionCookie(reader({ outro: "1" }))).toBeNull();
        expect(
            findSessionCookie(reader({ "better-auth.session_token": "" })),
        ).toBeNull();
    });
});
