import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const SRC = join(__dirname, "..");

function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        return statSync(path).isDirectory() ? walk(path) : [path];
    });
}

// Rotas reais: cada page.tsx de app/, sem os grupos "(painel)"; [x] vira um segmento qualquer
const routes = walk(join(SRC, "app"))
    .filter((f) => f.endsWith("/page.tsx"))
    .map((f) =>
        f
            .slice(join(SRC, "app").length, -"/page.tsx".length)
            .replace(/\/\([^/]+\)/g, "")
            .replace(/\[[^\]]+\]/g, "*"),
    )
    .map((r) => r || "/");

function exists(path: string): boolean {
    const segs = path.split("/");
    return routes.some((route) => {
        const rs = route.split("/");
        return (
            rs.length === segs.length &&
            rs.every((s, i) => s === "*" || segs[i] === "*" || s === segs[i])
        );
    });
}

describe("revalidatePath só aponta para rotas que existem (B6)", () => {
    const files = walk(join(SRC, "actions")).filter(
        (f) => f.endsWith(".ts") && !f.endsWith(".test.ts"),
    );

    it.each(files.map((f) => [f.slice(SRC.length + 1), f]))("%s", (_, file) => {
        const text = readFileSync(file, "utf8");
        const paths = [
            ...text.matchAll(/revalidatePath\(\s*[`"']([^`"']+)[`"']/g),
        ].map((m) => m[1].replace(/\$\{[^}]+\}/g, "*"));

        const inexistentes = paths.filter((p) => !exists(p));
        expect(inexistentes).toEqual([]);
    });
});
