import { z } from "zod";

const emptyToNull = z.preprocess(
    (val) =>
        val === "" || val === undefined || val === null || val === "null"
            ? null
            : val,
    z.string().nullable(),
);

const emptyUuidToNull = z.preprocess(
    (val) => {
        if (val === "" || val === undefined || val === null || val === "null") {
            return null;
        }
        return val;
    },
    z.union([z.string().uuid("UUID Inválido"), z.null()]),
);

const emptyNumberToNull = z.preprocess((val) => {
    if (val === "" || val === undefined || val === null || val === "null") {
        return null;
    }
    const parsed = Number(val);
    return isNaN(parsed) ? null : parsed;
}, z.number().int().min(1, "Porta inválida").nullable());

const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
const macSchema = z
    .preprocess(
        (val) => {
            if (
                val === "" ||
                val === null ||
                val === undefined ||
                val === "null"
            ) {
                return null;
            }
            return val;
        },
        z.union([
            z
                .string()
                .regex(macRegex, "MAC Address inválido")
                .transform((val) => val.toUpperCase().replace(/-/g, ":")),
            z.null(),
        ]),
    )
    .optional();

type AssetLocationConstraint = {
    departmentId?: string | null;
    locationId?: string | null;
};

const locationRefine = (data: AssetLocationConstraint) =>
    !!(data.departmentId || data.locationId);

const locationError = {
    message:
        "O Ativo deve estar vinculado a um Departamento ou a um Local físico.",
    path: ["locationId"],
};

const baseAssetFields = {
    patrimony: emptyToNull.optional(),
    departmentId: emptyUuidToNull.optional(),
    locationId: emptyUuidToNull.optional(),
    ipId: emptyUuidToNull.optional(),
    connectedToSwitchId: emptyUuidToNull.optional(),
    switchPort: emptyNumberToNull.optional(),
};

// 📦 SUB-ENTIDADES ATUALIZADAS
const computerData = z.object({
    username: z.string().min(2, "Username muito curto"),
    hostname: emptyToNull.optional(),
    mac: macSchema,
    anydesk: emptyToNull.optional(), // 👈 AnyDesk (padronizado como `anydesk`)
    processorId: emptyUuidToNull.optional(),
    memory: emptyToNull.optional(),
    diskId: emptyUuidToNull.optional(),
    osId: emptyUuidToNull.optional(),
    notes: emptyToNull.optional(),
});

const cameraData = z.object({
    model: z.string().min(1, "Modelo é obrigatório"),
    hostname: emptyToNull.optional(),
    channel: emptyToNull.optional(),
    serial: emptyToNull.optional(),
    mac: macSchema,
    notes: emptyToNull.optional(),
});

const printerData = z.object({
    model: z.string().min(1, "Modelo é obrigatório"),
    hostname: emptyToNull.optional(),
    serial: emptyToNull.optional(),
    code: emptyToNull.optional(),
    notes: emptyToNull.optional(),
});

const accessPointData = z.object({
    model: z.string().min(1, "Modelo é obrigatório"),
    mac: macSchema,
    vendor: emptyToNull.optional(),
    notes: emptyToNull.optional(),
});

const switchData = z.object({
    hostname: emptyToNull.optional(),
    model: z.string().min(1, "Modelo é obrigatório"),
    vendor: emptyToNull.optional(),
    totalPorts: z.coerce.number().int().min(1).default(24),
    mac: macSchema,
    notes: emptyToNull.optional(),
});

export const CreateAssetSchema = z.discriminatedUnion("type", [
    z
        .object({
            ...baseAssetFields,
            type: z.literal("COMPUTER"),
            computer: computerData,
        })
        .refine(locationRefine, locationError),
    z
        .object({
            ...baseAssetFields,
            type: z.literal("PRINTER"),
            printer: printerData,
        })
        .refine(locationRefine, locationError),
    z
        .object({
            ...baseAssetFields,
            type: z.literal("CAMERA"),
            camera: cameraData,
        })
        .refine(locationRefine, locationError),
]);

export const UpdateComputerSpecsSchema = z.object({
    username: z.string().min(2, "Username muito curto"),
    hostname: emptyToNull.optional(),
    mac: macSchema,
    anydesk: emptyToNull.optional(), // 👈 Garante que AnyDesk possa ser atualizado via modal/form
    processorId: emptyUuidToNull.optional(),
    memory: emptyToNull.optional(),
    diskId: emptyUuidToNull.optional(),
    osId: emptyUuidToNull.optional(),
    notes: emptyToNull.optional(),
});

export type CreateAssetInput = z.infer<typeof CreateAssetSchema>;

export type UpdateAssetInput = {
    patrimony?: string | null;
    departmentId?: string | null;
    locationId?: string | null;
    ipId?: string | null;
    connectedToSwitchId?: string | null;
    switchPort?: number | null;
    vlanType?: string;
    vlanTag?: number | null;
    computer?: z.infer<typeof UpdateComputerSpecsSchema> | null;
};
