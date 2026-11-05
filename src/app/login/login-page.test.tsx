// @vitest-environment jsdom
import {
    act,
    cleanup,
    fireEvent,
    render,
    screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import LoginPage from "./page";

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("next/image", () => ({
    default: () => null,
}));

vi.mock("@/lib/auth-client", () => ({
    authClient: {
        signIn: {
            email: async (
                _body: unknown,
                cb: {
                    onError: (ctx: {
                        error: {
                            message: string;
                            code: string;
                            status: number;
                        };
                    }) => void;
                },
            ) =>
                cb.onError({
                    error: {
                        message: "Invalid email or password",
                        code: "INVALID_EMAIL_OR_PASSWORD",
                        status: 401,
                    },
                }),
        },
    },
}));

afterEach(cleanup);

describe("Login (B4)", () => {
    it("a mensagem de erro é anunciada com role=alert", async () => {
        // A página lê searchParams com use(): precisa suspender e resolver
        const searchParams = Promise.resolve({});
        await act(async () => {
            render(<LoginPage searchParams={searchParams} />);
        });

        fireEvent.change(screen.getByLabelText(/e-mail/i), {
            target: { value: "a@b.com" },
        });
        fireEvent.change(screen.getByLabelText("Senha"), {
            target: { value: "errada" },
        });
        fireEvent.submit(screen.getByRole("button", { name: /entrar/i }));

        const alert = await screen.findByRole("alert");
        expect(alert.textContent).toContain("E-mail ou senha incorretos.");
        expect(alert.textContent).not.toMatch(/invalid/i);
    });

    it("o botão alterna a visibilidade da senha", async () => {
        const searchParams = Promise.resolve({});
        await act(async () => {
            render(<LoginPage searchParams={searchParams} />);
        });

        const input = screen.getByLabelText("Senha") as HTMLInputElement;
        expect(input.type).toBe("password");

        fireEvent.click(screen.getByRole("button", { name: "Mostrar senha" }));
        expect(input.type).toBe("text");

        fireEvent.click(screen.getByRole("button", { name: "Ocultar senha" }));
        expect(input.type).toBe("password");
    });
});
