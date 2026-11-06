// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { updateAssetConnectivityAction } from "@/actions/assets/shared.actions";

import { SwitchConnectionEditModal } from "./switch-connection-edit-modal";

vi.mock("@/actions/assets/shared.actions", () => ({
    updateAssetConnectivityAction: vi.fn(),
}));
vi.mock("next/navigation", () => ({
    useRouter: () => ({ refresh: vi.fn() }),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const SWITCH_ID = "b5211253-422a-4881-b9fb-e08d70977025";
const CYCLE_MESSAGE = "SW-B já está ligado, direta ou indiretamente, ao SW-A.";

afterEach(cleanup);

describe("SwitchConnectionEditModal: erro de ciclo (M22)", () => {
    it("mostra a mensagem da API no formulário e não fecha o modal", async () => {
        vi.mocked(updateAssetConnectivityAction).mockResolvedValue({
            success: false,
            error: CYCLE_MESSAGE,
        });
        const onClose = vi.fn();

        render(
            <SwitchConnectionEditModal
                isOpen
                onClose={onClose}
                assetId="5c65b037-6aa6-4faa-8d17-c79e155fa9bc"
                currentSwitchId={SWITCH_ID}
                currentPort="1"
                switches={[{ id: SWITCH_ID, name: "SW-B" }]}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

        // Duas vezes: junto ao campo do switch e no aviso geral do formulário
        await waitFor(() =>
            expect(screen.getAllByText(CYCLE_MESSAGE)).toHaveLength(2),
        );
        expect(updateAssetConnectivityAction).toHaveBeenCalledWith(
            "5c65b037-6aa6-4faa-8d17-c79e155fa9bc",
            { connectedToSwitchId: SWITCH_ID, switchPort: 1 },
        );
        expect(onClose).not.toHaveBeenCalled();
    });
});
