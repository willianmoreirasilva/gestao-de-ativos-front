// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import PainelError from "./error";
import PainelNotFound from "./not-found";

afterEach(cleanup);

describe("páginas de erro do painel (B5)", () => {
    it("error.tsx mostra mensagem em português e tenta de novo", () => {
        const retry = vi.fn();
        vi.spyOn(console, "error").mockImplementation(() => {});
        render(
            <PainelError
                error={Object.assign(new Error("boom interno"), {
                    digest: "abc123",
                })}
                retry={retry}
            />,
        );

        expect(screen.getByRole("alert").textContent).toContain(
            "Algo deu errado",
        );
        // detalhes técnicos não vão para a tela, só o código para os logs
        expect(document.body.textContent).not.toContain("boom interno");
        expect(document.body.textContent).toContain("abc123");

        fireEvent.click(
            screen.getByRole("button", { name: "Tentar novamente" }),
        );
        expect(retry).toHaveBeenCalledTimes(1);
    });

    it("not-found.tsx avisa e leva ao dashboard", () => {
        render(<PainelNotFound />);
        expect(screen.getByText("Página não encontrada")).toBeTruthy();
        expect(
            screen
                .getByRole("link", { name: /voltar ao dashboard/i })
                .getAttribute("href"),
        ).toBe("/dashboard");
    });
});
