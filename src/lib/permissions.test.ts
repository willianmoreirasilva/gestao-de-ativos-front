import { describe, expect, it } from "vitest";

import {
    type Action,
    ACTIONS,
    assetResource,
    can,
    canManageVlan,
    canSeeCameras,
    canSeeNetworkType,
    inNetworkScope,
    ipNetworkScope,
    reservationNetworkTypes,
    type Resource,
    RESOURCES,
    type Role,
    ROLES,
} from "./permissions.js";

// Transcrição da matriz oficial (docs/permissoes.md).
// Ordem das colunas: SUPERADM, ADMIN, CAM_OPERATOR, USER.
// Ação ausente = inexistente (negada para todos).
const EXPECTED: Record<Resource, Partial<Record<Action, string>>> = {
    users: {
        view: "✅❌❌❌",
        create: "✅❌❌❌",
        update: "✅❌❌❌",
        delete: "✅❌❌❌",
    },
    profile: { view: "✅✅✅✅", update: "✅✅✅✅" },
    networks: {
        view: "✅✅✅✅",
        create: "✅✅❌❌",
        update: "✅✅❌❌",
        delete: "✅✅❌❌",
    },
    assets: {
        view: "✅✅✅✅",
        viewDetails: "✅✅✅✅",
        create: "✅✅✅✅",
        update: "✅✅✅✅",
        delete: "✅✅✅✅",
    },
    cameras: {
        view: "✅✅✅❌",
        viewDetails: "✅✅✅❌",
        create: "✅❌✅❌",
        update: "✅❌✅❌",
        delete: "✅❌✅❌",
    },
    networkDevices: {
        view: "✅✅✅✅",
        viewDetails: "✅✅❌❌",
        viewSecrets: "✅✅❌❌",
        create: "✅✅❌❌",
        update: "✅✅❌❌",
        delete: "✅✅❌❌",
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
    reports: { view: "✅✅❌❌" },
    cameraReports: { view: "✅✅✅❌" },
    auditLogs: { view: "✅❌❌❌" },
    ipFree: { view: "✅✅✅✅" },
    ipUsage: { view: "✅✅✅❌" },
    ipReservations: {
        view: "✅✅✅❌",
        create: "✅✅✅❌",
        update: "✅✅✅❌",
        delete: "✅✅✅❌",
    },
};

const COLUMNS: Role[] = ["SUPERADM", "ADMIN", "CAM_OPERATOR", "USER"];

function expectedFor(resource: Resource, action: Action, role: Role) {
    const cell = EXPECTED[resource][action];
    // "✅" e "❌" ocupam um code point cada
    return cell ? [...cell][COLUMNS.indexOf(role)] === "✅" : false;
}

describe("can() cobre a matriz inteira", () => {
    it("a transcrição tem 4 colunas por célula", () => {
        for (const resource of RESOURCES) {
            for (const cell of Object.values(EXPECTED[resource])) {
                expect([...cell]).toHaveLength(4);
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
    it("câmera usa cameras; switch e AP, networkDevices; os demais, assets", () => {
        expect(assetResource("CAMERA")).toBe("cameras");
        expect(assetResource("SWITCH")).toBe("networkDevices");
        expect(assetResource("ACCESS_POINT")).toBe("networkDevices");
        expect(assetResource("COMPUTER")).toBe("assets");
        expect(assetResource("PRINTER")).toBe("assets");
        expect(assetResource("OTHER")).toBe("assets");
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

    it("escopo de IP por role", () => {
        expect(ipNetworkScope("SUPERADM", "ipUsage")).toEqual({});
        expect(ipNetworkScope("ADMIN", "ipReservations", "update")).toEqual({});
        expect(ipNetworkScope("CAM_OPERATOR", "ipFree")).toEqual({});
        expect(ipNetworkScope("CAM_OPERATOR", "ipUsage")).toEqual({
            only: ["CAMERA_VLAN"],
        });
        expect(ipNetworkScope("CAM_OPERATOR", "ipReservations")).toEqual({
            only: ["CAMERA_VLAN"],
        });
        expect(ipNetworkScope("USER", "ipFree")).toEqual({
            exclude: ["CAMERA_VLAN"],
        });
        expect(ipNetworkScope("USER", "ipUsage")).toBeNull();
        expect(ipNetworkScope("USER", "ipReservations", "create")).toBeNull();
        expect(ipNetworkScope(null, "ipFree")).toBeNull();
    });

    it("inNetworkScope respeita only, exclude e ausência de acesso", () => {
        expect(inNetworkScope({}, "GENERAL_DATA")).toBe(true);
        expect(inNetworkScope({ only: ["CAMERA_VLAN"] }, "CAMERA_VLAN")).toBe(
            true,
        );
        expect(inNetworkScope({ only: ["CAMERA_VLAN"] }, "GENERAL_DATA")).toBe(
            false,
        );
        expect(
            inNetworkScope({ exclude: ["CAMERA_VLAN"] }, "CAMERA_VLAN"),
        ).toBe(false);
        expect(inNetworkScope(null, "GENERAL_DATA")).toBe(false);
    });

    it("canManageVlan: CAM_OPERATOR só na VLAN de câmeras; USER em nenhuma", () => {
        for (const type of ["GENERAL_DATA", "CAMERA_VLAN", "SWITCH_MGMT"]) {
            expect(canManageVlan("SUPERADM", type)).toBe(true);
            expect(canManageVlan("ADMIN", type, "delete")).toBe(true);
            expect(canManageVlan("USER", type)).toBe(false);
        }
        expect(canManageVlan("CAM_OPERATOR", "CAMERA_VLAN")).toBe(true);
        expect(canManageVlan("CAM_OPERATOR", "CAMERA_VLAN", "update")).toBe(
            true,
        );
        expect(canManageVlan("CAM_OPERATOR", "GENERAL_DATA")).toBe(false);
        expect(canManageVlan("CAM_OPERATOR", "WIFI_MGMT", "update")).toBe(
            false,
        );
    });

    it("só o USER deixa de enxergar a VLAN de câmeras", () => {
        expect(canSeeNetworkType("USER", "CAMERA_VLAN")).toBe(false);
        expect(canSeeNetworkType("USER", "GENERAL_DATA")).toBe(true);
        expect(canSeeNetworkType("CAM_OPERATOR", "GENERAL_DATA")).toBe(true);
        expect(canSeeNetworkType("ADMIN", "CAMERA_VLAN")).toBe(true);
    });
});
