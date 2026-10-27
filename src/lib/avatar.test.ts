import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resolveAvatarUrl } from "@/lib/avatar";

describe("resolveAvatarUrl", () => {
    beforeEach(() => {
        vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.teste");
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("sem imagem devolve undefined", () => {
        expect(resolveAvatarUrl(null)).toBeUndefined();
        expect(resolveAvatarUrl(undefined)).toBeUndefined();
        expect(resolveAvatarUrl("")).toBeUndefined();
    });

    it("caminho relativo da API ganha o prefixo NEXT_PUBLIC_API_URL", () => {
        expect(resolveAvatarUrl("/api/avatars/abc.webp")).toBe(
            "http://api.teste/api/avatars/abc.webp",
        );
    });

    // Comportamento atual (A1 ainda aberto): URLs absolutas passam direto
    it("URLs absolutas e pré-visualizações locais passam direto", () => {
        expect(resolveAvatarUrl("https://exemplo.com/a.png")).toBe(
            "https://exemplo.com/a.png",
        );
        expect(resolveAvatarUrl("blob:http://localhost/1")).toBe(
            "blob:http://localhost/1",
        );
        expect(resolveAvatarUrl("data:image/png;base64,AAAA")).toBe(
            "data:image/png;base64,AAAA",
        );
    });
});
