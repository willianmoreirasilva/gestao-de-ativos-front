import { describe, expect, it } from "vitest";

import { formatFloor } from "./location-floor";

describe("formatFloor", () => {
    it.each([
        ["1", "1º Andar"],
        ["2", "2º Andar"],
        ["10", "10º Andar"],
        [" 3 ", "3º Andar"],
        ["02", "2º Andar"],
    ])("número %j → %j", (input, expected) => {
        expect(formatFloor(input)).toBe(expected);
    });

    it.each([
        ["3º andar", "3º Andar"],
        ["3º", "3º Andar"],
        ["3°", "3º Andar"],
        ["3o", "3º Andar"],
        ["3 ANDAR", "3º Andar"],
        ["3º  Andar", "3º Andar"],
    ])(
        "número já com ordinal ou 'andar' %j → %j (sem repetir)",
        (input, expected) => {
            expect(formatFloor(input)).toBe(expected);
        },
    );

    it.each(["térreo", "terreo", "Térreo", "TERREO", "TÉRREO", " Terreo "])(
        "térreo: %j → Térreo",
        (input) => {
            expect(formatFloor(input)).toBe("Térreo");
        },
    );

    it.each(["subsolo", "Subsolo", "SUBSOLO", " subsolo "])(
        "subsolo: %j → Subsolo",
        (input) => {
            expect(formatFloor(input)).toBe("Subsolo");
        },
    );

    it.each([
        "último andar",
        "ultimo andar",
        "Último Andar",
        "ULTIMO ANDAR",
        "último",
        "Ultimo",
    ])("último andar: %j → Último andar", (input) => {
        expect(formatFloor(input)).toBe("Último andar");
    });

    it.each([null, undefined, "", "   ", "N/A", "n/a", " N/A "])(
        "sem andar: %j → null",
        (input) => {
            expect(formatFloor(input)).toBeNull();
        },
    );

    it.each(["Mezanino", "2 ANDAR2", "Cobertura"])(
        "valor fora das regras aparece como foi gravado, sem 'º Andar': %j",
        (input) => {
            expect(formatFloor(input)).toBe(input);
        },
    );
});
