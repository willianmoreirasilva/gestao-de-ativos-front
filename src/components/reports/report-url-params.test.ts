import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();
const container = readFileSync(
    join(root, "src/components/reports/report-container.tsx"),
    "utf8",
);
const page = readFileSync(
    join(root, "src/app/(painel)/reports-audit/reports/page.tsx"),
    "utf8",
);

// O container grava os filtros na URL e a página (Server Component) os lê:
// um nome diferente nos dois lados descarta o filtro em silêncio (M21)
describe("parâmetros de URL do relatório", () => {
    const written = [
        ...new Set(
            [...container.matchAll(/params\.set\("(\w+)"/g)].map((m) => m[1]),
        ),
        // "page" e "limit" são lidos à parte. "printerSerial" ainda não existe na
        // página nem no back (o filtro de serial é ignorado): ver nota no M21
    ].filter((key) => !["page", "limit", "printerSerial"].includes(key));

    it("o container grava algum filtro", () => {
        expect(written.length).toBeGreaterThan(10);
    });

    it.each(written)("a página lê o parâmetro %s", (key) => {
        expect(page).toMatch(new RegExp(`params\\.${key}\\b`));
    });
});
