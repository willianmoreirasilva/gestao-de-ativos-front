import { describe, expect, it } from "vitest";

import { ENTITY_LABELS } from "@/types/audit";

import { getFormattedEntity } from "./audit-utils";

describe("getFormattedEntity", () => {
    it("usa o tipo de details para ativos", () => {
        expect(
            getFormattedEntity({
                entity: "ASSET",
                details: { type: "computer" },
            }),
        ).toBe(ENTITY_LABELS.COMPUTER);
    });

    it("procura o tipo em createdData, before e after", () => {
        for (const key of ["createdData", "before", "after"]) {
            expect(
                getFormattedEntity({
                    entity: "ASSET",
                    details: { [key]: { type: "PRINTER" } },
                }),
            ).toBe(ENTITY_LABELS.PRINTER);
        }
    });

    it("ignora tipo que não é texto, sem quebrar", () => {
        expect(
            getFormattedEntity({ entity: "ASSET", details: { type: 5 } }),
        ).toBe(ENTITY_LABELS.ASSET ?? "ASSET");
    });

    it("sem details usa o rótulo da entidade", () => {
        expect(getFormattedEntity({ entity: "ASSET", details: null })).toBe(
            ENTITY_LABELS.ASSET ?? "ASSET",
        );
    });
});
