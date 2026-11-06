import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resolveAvatarUrl } from "@/lib/avatar";

const AVATAR = "/api/avatars/0f8e2c1a-3b4d-4e5f-8a9b-0c1d2e3f4a5b.webp";

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

    it("avatar gerado pela API ganha o prefixo NEXT_PUBLIC_API_URL", () => {
        expect(resolveAvatarUrl(AVATAR)).toBe(`http://api.teste${AVATAR}`);
    });

    it("pré-visualização local (blob:) passa direto", () => {
        expect(resolveAvatarUrl("blob:http://localhost:3000/1")).toBe(
            "blob:http://localhost:3000/1",
        );
    });

    // A1: uma URL externa vira um pixel de rastreamento de quem abre a tela
    it("recusa URLs absolutas, data: e caminhos fora de /api/avatars/", () => {
        for (const image of [
            "https://rastreador.exemplo/pixel.png",
            "http://api.teste/api/avatars/a.webp",
            "//rastreador.exemplo/pixel.png",
            "data:image/png;base64,AAAA",
            "javascript:alert(1)",
            "/api/users/me",
            "/api/avatars/../users/me",
            "/api/avatars/foto.png",
            `${AVATAR}?x=1`,
        ]) {
            expect(resolveAvatarUrl(image), image).toBeUndefined();
        }
    });
});
