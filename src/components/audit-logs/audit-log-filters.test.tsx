// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuditLogFilters } from "./audit-log-filters";

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => "/reports-audit/audit",
    useSearchParams: () => new URLSearchParams("search=abc"),
}));

afterEach(cleanup);

describe("AuditLogFilters (B4)", () => {
    it("todos os controles têm nome acessível", () => {
        render(<AuditLogFilters />);

        expect(screen.getByLabelText("Pesquisar")).toBeTruthy();
        expect(screen.getByLabelText("Limpar pesquisa")).toBeTruthy();
        expect(screen.getByLabelText("Filtrar por ação")).toBeTruthy();
        expect(screen.getByLabelText("Filtrar por entidade")).toBeTruthy();
        expect(screen.getByLabelText("Data inicial")).toBeTruthy();
        expect(screen.getByLabelText("Data final")).toBeTruthy();
    });
});
