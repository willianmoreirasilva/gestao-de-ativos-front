import { describe, expect, it } from "vitest";

import {
    type Action,
    ACTIONS,
    assetResource,
    can,
    canSeeCameras,
    reservationNetworkTypes,
    type Resource,
    RESOURCES,
    type Role,
    ROLES,
} from "./permissions.js";

// Transcrição da matriz oficial (docs/permissoes.md).
// Ordem das colunas: SUPERADM, ADMIN, CAM_OPERATOR, USER. "-" = ação inexistente (negada).
const EXPECTED: Record<Resource, Record<Action, string>> = {
    users: {
        view: "✅❌❌❌",
        create: "✅❌❌❌",
        update: "✅❌❌❌",
        delete: "✅❌❌❌",
    },
    profile: {
        view: "✅✅✅✅",
        create: "----",
        update: "✅✅✅✅",
        delete: "----",
    },
    networks: {
        view: "✅✅✅✅",
        create: "✅✅❌❌",
        update: "✅✅❌❌",
        delete: "✅✅❌❌",
    },
    assets: {
        view: "✅✅✅✅",
        create: "✅✅✅✅",
        update: "✅✅✅✅",
        delete: "✅✅✅✅",
    },
    cameras: {
        view: "✅✅✅❌",
        create: "✅❌✅❌",
        update: "✅❌✅❌",
        delete: "✅❌✅❌",
    },
    departments: {
        view: "✅✅✅✅",
        create: "✅✅✅✅",
        update: "✅✅✅✅",
        delete: "✅✅❌❌",
    },
    locations: {
        view: "✅✅✅✅",
        create: "✅✅✅✅",
        update: "✅✅✅✅",
        delete: "✅✅❌❌",
    },
    reports: {
        view: "✅✅❌❌",
        create: "----",
        update: "----",
        delete: "----",
    },
    cameraReports: {
        view: "✅✅✅❌",
        create: "----",
        update: "----",
        delete: "----",
    },
    auditLogs: {
        view: "✅❌❌❌",
        create: "----",
        update: "----",
        delete: "----",
    },
    ipReservations: {
        view: "✅✅✅❌",
        create: "✅✅✅❌",
        update: "----",
        delete: "✅✅✅❌",
    },
};

const COLUMNS: Role[] = ["SUPERADM", "ADMIN", "CAM_OPERATOR", "USER"];

function expectedFor(resource: Resource, action: Action, role: Role) {
    // "✅", "❌" e "-" ocupam um code point cada
    return [...EXPECTED[resource][action]][COLUMNS.indexOf(role)] === "✅";
}

describe("can() cobre a matriz inteira", () => {
    it("a transcrição tem 4 colunas por célula", () => {
        for (const resource of RESOURCES) {
            for (const action of ACTIONS) {
                expect([...EXPECTED[resource][action]]).toHaveLength(4);
            }
        }
    });

    for (const resource of RESOURCES) {
        for (const action of ACTIONS) {
            for (const role of ROLES) {
                const allowed = expectedFor(resource, action, role);
                it(`${role} ${allowed ? "pode" : "não pode"} ${action} ${resource}`, () => {
                    expect(can(role, resource, action)).toBe(allowed);
                });
            }
        }
    }

    it("sem role nada é permitido", () => {
        expect(can(null, "assets", "view")).toBe(false);
        expect(can(undefined, "profile", "view")).toBe(false);
    });
});

describe("regras derivadas", () => {
    it("câmera usa o recurso cameras; os demais tipos, assets", () => {
        expect(assetResource("CAMERA")).toBe("cameras");
        expect(assetResource("COMPUTER")).toBe("assets");
        expect(assetResource("SWITCH")).toBe("assets");
    });

    it("só o USER deixa de enxergar câmeras", () => {
        expect(canSeeCameras("USER")).toBe(false);
        expect(canSeeCameras("ADMIN")).toBe(true);
        expect(canSeeCameras("CAM_OPERATOR")).toBe(true);
        expect(canSeeCameras("SUPERADM")).toBe(true);
    });

    it("reserva de IP: CAM_OPERATOR só em CAMERA_VLAN e USER em nenhuma rede", () => {
        expect(reservationNetworkTypes("SUPERADM")).toBeNull();
        expect(reservationNetworkTypes("ADMIN")).toBeNull();
        expect(reservationNetworkTypes("CAM_OPERATOR")).toEqual([
            "CAMERA_VLAN",
        ]);
        expect(reservationNetworkTypes("USER")).toEqual([]);
    });
});
