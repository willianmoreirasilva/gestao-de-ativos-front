// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AssetAllocationCard } from "@/components/assets/shared/asset-allocation-card";
import { Table, TableBody } from "@/components/ui/table";

import { LocationItem } from "./location-item";

vi.mock("@/actions/locations", () => ({ deleteLocationAction: vi.fn() }));
vi.mock("@/actions/assets/shared.actions", () => ({
    updateAssetAllocationAction: vi.fn(),
}));
vi.mock("next/navigation", () => ({
    useRouter: () => ({ refresh: vi.fn() }),
}));

afterEach(cleanup);

const CASES = [
    ["2", "2º Andar"],
    ["terreo", "Térreo"],
    ["SUBSOLO", "Subsolo"],
    ["ultimo andar", "Último andar"],
] as const;

describe("exibição do andar nas telas", () => {
    it.each(CASES)("lista de localidades: %j → %j", (floor, expected) => {
        render(
            <Table>
                <TableBody>
                    <LocationItem location={{ id: "1", name: "Sede", floor }} />
                </TableBody>
            </Table>,
        );

        expect(screen.getByText(expected)).toBeTruthy();
    });

    it.each(CASES)("card de alocação do ativo: %j → %j", (floor, expected) => {
        render(
            <AssetAllocationCard
                assetId="a1"
                location={{ id: "1", name: "Sede", floor }}
                options={{ departments: [], locations: [] }}
                readOnly
            />,
        );

        expect(screen.getByText(expected)).toBeTruthy();
    });

    it("card de alocação: andar N/A não aparece", () => {
        render(
            <AssetAllocationCard
                assetId="a1"
                location={{ id: "1", name: "Sede", floor: "N/A" }}
                options={{ departments: [], locations: [] }}
                readOnly
            />,
        );

        expect(screen.queryByText(/N\/A/)).toBeNull();
    });
});
