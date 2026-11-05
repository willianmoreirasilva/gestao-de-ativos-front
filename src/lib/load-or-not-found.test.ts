import { afterEach, describe, expect, it, vi } from "vitest";

const notFound = vi.hoisted(() =>
    vi.fn(() => {
        throw new Error("NEXT_NOT_FOUND");
    }),
);
vi.mock("next/navigation", () => ({ notFound }));

import { loadOrNotFound } from "./load-or-not-found";

afterEach(() => vi.restoreAllMocks());

describe("loadOrNotFound (B5)", () => {
    it("devolve o dado quando existe", () => {
        expect(
            loadOrNotFound(
                { data: { id: "1" }, error: null, status: 200 },
                "departamento",
            ),
        ).toEqual({ id: "1" });
    });

    it.each([404, 400])(
        "status %i vira notFound(), sem console.error",
        (status) => {
            const spy = vi.spyOn(console, "error").mockImplementation(() => {});
            expect(() =>
                loadOrNotFound(
                    { data: null, error: "x", status },
                    "departamento",
                ),
            ).toThrow("NEXT_NOT_FOUND");
            expect(spy).not.toHaveBeenCalled();
        },
    );

    it.each([500, 502, null])(
        "status %s registra o erro e lança, para cair no error.tsx",
        (status) => {
            const spy = vi.spyOn(console, "error").mockImplementation(() => {});
            notFound.mockClear();
            expect(() =>
                loadOrNotFound(
                    { data: null, error: "Back fora do ar", status },
                    "departamento",
                ),
            ).toThrow("Back fora do ar");
            expect(spy).toHaveBeenCalledTimes(1);
            expect(notFound).not.toHaveBeenCalled();
        },
    );
});
