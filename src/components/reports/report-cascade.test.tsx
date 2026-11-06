// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { AssetReportData } from "@/types/report";

import { ReportCascadeNotice } from "./report-cascade-notice";
import { ReportPrintModal } from "./report-print-modal";
import { ReportTableContent } from "./table/report-table-content";

afterEach(cleanup);

const rows: AssetReportData[] = [
    {
        id: "1",
        type: "COMPUTER",
        patrimony: "PC-1",
        cascadeLevel: 1,
        cascadePath: "SW-A",
    },
    {
        id: "2",
        type: "SWITCH",
        patrimony: "SW-C",
        cascadeLevel: 2,
        cascadePath: "SW-A → SW-B",
    },
];

describe("relatório com switch em cascata (M23)", () => {
    it("a tabela mostra Nível e Conectado via só com a cascata ligada", () => {
        const { rerender } = render(
            <ReportTableContent data={rows} showCascade />,
        );
        expect(screen.getByText("Nível")).toBeTruthy();
        expect(screen.getByText("Conectado via")).toBeTruthy();
        expect(screen.getByText("SW-A → SW-B")).toBeTruthy();
        expect(screen.getByText("2")).toBeTruthy();

        rerender(<ReportTableContent data={rows} />);
        expect(screen.queryByText("Conectado via")).toBeNull();
        expect(screen.queryByText("SW-A → SW-B")).toBeNull();
    });

    it("a exportação (impressão) leva as duas colunas", () => {
        render(
            <ReportPrintModal
                isOpen
                onClose={() => {}}
                activeFiltersLabels={[]}
                summary={{
                    totalAssets: 2,
                    withIp: 0,
                    withoutIp: 2,
                    departmentsCount: 0,
                }}
                data={rows}
                showCascade
                cascade={{ maxDepth: 10, truncated: false }}
            />,
        );
        expect(screen.getByText("Nível")).toBeTruthy();
        expect(screen.getByText("Conectado via")).toBeTruthy();
        expect(screen.getByText("SW-A → SW-B")).toBeTruthy();
    });

    it("avisa quando a cascata foi cortada no limite e some quando não foi", () => {
        const { rerender } = render(
            <ReportCascadeNotice cascade={{ maxDepth: 10, truncated: true }} />,
        );
        expect(screen.getByRole("alert").textContent).toContain(
            "Resultado limitado a 10 níveis",
        );

        rerender(
            <ReportCascadeNotice
                cascade={{ maxDepth: 10, truncated: false }}
            />,
        );
        expect(screen.queryByRole("alert")).toBeNull();
        rerender(<ReportCascadeNotice />);
        expect(screen.queryByRole("alert")).toBeNull();
    });

    it("a impressão repete o aviso de corte", () => {
        render(
            <ReportPrintModal
                isOpen
                onClose={() => {}}
                activeFiltersLabels={[]}
                summary={{
                    totalAssets: 0,
                    withIp: 0,
                    withoutIp: 0,
                    departmentsCount: 0,
                }}
                data={[]}
                showCascade
                cascade={{ maxDepth: 10, truncated: true }}
            />,
        );
        expect(screen.getByText(/Resultado limitado a 10 níveis/)).toBeTruthy();
    });
});
