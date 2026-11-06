import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const APP_DIR = join(__dirname);

function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        return statSync(path).isDirectory() ? walk(path) : [path];
    });
}

const HAS_TITLE = /export const metadata[^=]*=\s*\{\s*title:/;

describe("títulos das páginas (B5)", () => {
    const files = walk(APP_DIR);
    const pages = files.filter((f) => f.endsWith("/page.tsx"));

    it("o layout raiz tem título padrão e modelo", () => {
        const root = readFileSync(join(APP_DIR, "layout.tsx"), "utf8");
        expect(root).toContain('default: "NetManager"');
        expect(root).toContain('template: "%s · NetManager"');
    });

    it("toda página (exceto o redirecionamento da raiz) define um título, na página ou no layout da pasta", () => {
        const semTitulo = pages
            .filter((p) => p !== join(APP_DIR, "page.tsx"))
            .filter((p) => {
                const layout = p.replace(/page\.tsx$/, "layout.tsx");
                const own = HAS_TITLE.test(readFileSync(p, "utf8"));
                const inLayout =
                    files.includes(layout) &&
                    HAS_TITLE.test(readFileSync(layout, "utf8"));
                return !own && !inLayout;
            })
            .map((p) => p.slice(APP_DIR.length + 1));

        expect(semTitulo).toEqual([]);
    });
});
