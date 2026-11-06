import { describe, expect, it } from "vitest";

import { connectivityErrorField } from "./connectivity-error";

describe("connectivityErrorField", () => {
    it("ciclo e auto-ligação vão para o campo do switch", () => {
        expect(
            connectivityErrorField(
                "SW-B já está ligado, direta ou indiretamente, ao SW-A.",
            ),
        ).toBe("connectedToSwitchId");
        expect(
            connectivityErrorField("SW-A não pode ser ligado a ele mesmo."),
        ).toBe("connectedToSwitchId");
    });

    it("o nome do switch com 'porta' não desvia o ciclo para a porta", () => {
        expect(
            connectivityErrorField(
                "SW-Portaria já está ligado, direta ou indiretamente, ao SW-A.",
            ),
        ).toBe("connectedToSwitchId");
    });

    it("porta ocupada ou fora do limite vai para o campo da porta", () => {
        expect(
            connectivityErrorField(
                "A porta 3 do switch já está ocupada por outro ativo.",
            ),
        ).toBe("switchPort");
        expect(
            connectivityErrorField(
                "A porta 30 é maior que o limite físico do Switch (24 portas).",
            ),
        ).toBe("switchPort");
    });

    it("outras mensagens não escolhem campo", () => {
        expect(connectivityErrorField("Ativo não encontrado")).toBeNull();
        expect(connectivityErrorField(undefined)).toBeNull();
    });
});
