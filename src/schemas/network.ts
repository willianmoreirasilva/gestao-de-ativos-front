import { z } from "zod";

export const VLAN_TAG_MIN = 0;
export const VLAN_TAG_MAX = 4094;

export const VLAN_RESERVED = {
    TRAFFIC: 0,
    DEFAULT: 1,
    PROTOCOLS_MIN: 1002,
    PROTOCOLS_MAX: 1005,
} as const;

export function getVlanTagError(vlan: number): string | null {
    if (!Number.isInteger(vlan)) {
        return "VLAN Tag deve ser um número inteiro";
    }

    if (vlan < VLAN_TAG_MIN || vlan > VLAN_TAG_MAX) {
        return `VLAN Tag deve estar entre ${VLAN_TAG_MIN} e ${VLAN_TAG_MAX}`;
    }

    if (vlan === VLAN_RESERVED.TRAFFIC) {
        return "VLAN 0 é reservada para tráfego interno";
    }

    if (vlan === VLAN_RESERVED.DEFAULT) {
        return "VLAN 1 é reservada para a VLAN padrão";
    }

    if (
        vlan >= VLAN_RESERVED.PROTOCOLS_MIN &&
        vlan <= VLAN_RESERVED.PROTOCOLS_MAX
    ) {
        return "VLANs 1002 a 1005 são reservadas para protocolos";
    }

    return null;
}

export function isAllowedVlanTag(vlan: number): boolean {
    return getVlanTagError(vlan) === null;
}

const vlanTagSchema = z.preprocess(
    (value) => {
        if (value === "" || value === null || value === undefined) {
            return null;
        }

        const parsed = Number(value);
        return Number.isNaN(parsed) ? value : parsed;
    },
    z
        .union([
            z.null(),
            z
                .number({ error: "VLAN Tag deve ser um número" })
                .int("VLAN Tag deve ser um número inteiro")
                .superRefine((vlan, ctx) => {
                    const error = getVlanTagError(vlan);
                    if (error) {
                        ctx.addIssue({ code: "custom", message: error });
                    }
                }),
        ])
        .optional(),
);

export const networkSchema = z.object({
    networkAddress: z
        .string()
        .trim()
        .min(1, "O endereço de rede é obrigatório")
        .pipe(z.ipv4("Insira um endereço IPv4 válido")),
    cidr: z.coerce
        .number()
        .int("O CIDR deve ser um número inteiro")
        .min(0, "O CIDR deve ser no mínimo 0")
        .max(32, "O CIDR máximo para IPv4 é 32"),
    vlanTag: vlanTagSchema,
    type: z.enum(["GENERAL_DATA", "CAMERA_VLAN", "SWITCH_MGMT", "WIFI_MGMT"], {
        message: "Selecione um tipo de rede válido",
    }),
});
