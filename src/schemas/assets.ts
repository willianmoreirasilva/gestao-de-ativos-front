import { z } from "zod";

// ==========================================
// 🛠️ HELPERS DE SANITIZAÇÃO (Blindagem de Formulários)
// ==========================================

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

// ==========================================
// 🔌 CAMPOS COMUNS A TODOS OS ATIVOS
// ==========================================
const baseAssetFields = {
    patrimony: emptyToNull.optional(),
    departmentId: emptyUuidToNull.optional(),
    locationId: emptyUuidToNull.optional(),
    ipId: emptyUuidToNull.optional(),
    connectedToSwitchId: emptyUuidToNull.optional(),
    switchPort: emptyNumberToNull.optional(),
};

// ==========================================
// 📦 SCHEMAS ESPECÍFICOS DE SUB-ENTIDADES
// ==========================================

const computerData = z.object({
    username: z.string().min(2, "Username muito curto"),
    hostname: emptyToNull.optional(),
    mac: macSchema,
    processorId: emptyUuidToNull.optional(),
    memory: emptyToNull.optional(),
    diskId: emptyUuidToNull.optional(),
    osId: emptyUuidToNull.optional(),
    notes: emptyToNull.optional(), // 🌟 Suporte a anotações reintroduzido
});

const cameraData = z.object({
    model: z.string().min(1, "Modelo é obrigatório"),
    serial: emptyToNull.optional(),
    mac: macSchema,
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

// ==========================================
// 🚀 EXPORTAÇÃO DOS SCHEMAS PRINCIPAIS
// ==========================================

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
            printer: z.object({
                model: z.string().min(1, "Modelo é obrigatório"),
                hostname: emptyToNull.optional(),
                serial: emptyToNull.optional(),
                code: emptyToNull.optional(),
                notes: emptyToNull.optional(),
            }),
        })
        .refine(locationRefine, locationError),
    z
        .object({
            ...baseAssetFields,
            type: z.literal("PHONE"),
            phone: z.object({
                phoneNumber: z.string().min(1, "Número é obrigatório"),
                model: emptyToNull.optional(),
                notes: emptyToNull.optional(),
            }),
        })
        .refine(locationRefine, locationError),
    z
        .object({
            ...baseAssetFields,
            type: z.literal("CAMERA"),
            ipId: z.string().uuid("Câmeras precisam de um IP."),
            camera: cameraData,
        })
        .refine(locationRefine, locationError),
    z
        .object({
            ...baseAssetFields,
            type: z.literal("ACCESS_POINT"),
            ipId: z.string().uuid("Access Points exigem um IP fixo."),
            accessPoint: accessPointData,
        })
        .refine(locationRefine, locationError),
    z
        .object({
            ...baseAssetFields,
            type: z.literal("SWITCH"),
            switch: switchData,
        })
        .refine(locationRefine, locationError),
    z
        .object({ ...baseAssetFields, type: z.literal("OTHER") })
        .refine(locationRefine, locationError),
]);

export const AssetTypeEnum = z.enum([
    "COMPUTER",
    "PRINTER",
    "PHONE",
    "ACCESS_POINT",
    "SWITCH",
    "CAMERA",
    "OTHER",
]);

export const AssetResponseSchema = z.object({
    id: z.string().uuid(),
    patrimony: z.string().nullable(),
    type: AssetTypeEnum,
    departmentId: z.string().uuid().nullable(),
    locationId: z.string().uuid().nullable(),
    ipId: z.string().uuid().nullable(),
    connectedToSwitchId: z.string().uuid().nullable(),
    switchPort: z.number().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    department: z
        .object({ id: z.string().uuid(), name: z.string() })
        .nullable()
        .optional(),
    location: z
        .object({
            id: z.string().uuid(),
            name: z.string(),
            building: z.string().nullable(),
            floor: z.string().nullable(),
            room: z.string().nullable(),
        })
        .nullable()
        .optional(),
    ip: z
        .object({ id: z.string().uuid(), address: z.string() })
        .nullable()
        .optional(),
    connectedToSwitch: z
        .object({
            id: z.string().uuid(),
            model: z.string(),
            vendor: z.string().nullable(),
        })
        .nullable()
        .optional(),
    computer: z
        .object({
            id: z.string().uuid(),
            username: z.string(),
            hostname: z.string().nullable(),
            mac: z.string().nullable(),
            memory: z.string().nullable(),
            notes: z.string().nullable(),
            processor: z
                .object({ id: z.string().uuid(), name: z.string() })
                .nullable()
                .optional(),
            disk: z
                .object({ id: z.string().uuid(), name: z.string() })
                .nullable()
                .optional(),
            operatingSystem: z
                .object({ id: z.string().uuid(), name: z.string() })
                .nullable()
                .optional(),
        })
        .nullable()
        .optional(),
    camera: z
        .object({
            id: z.string().uuid(),
            model: z.string(),
            serial: z.string().nullable(),
            mac: z.string().nullable(),
            notes: z.string().nullable(),
        })
        .nullable()
        .optional(),
    printer: z
        .object({
            id: z.string().uuid(),
            hostname: z.string().nullable(),
            model: z.string(),
            code: z.string().nullable(),
            serial: z.string().nullable(),
            notes: z.string().nullable(),
        })
        .nullable()
        .optional(),
    phone: z
        .object({
            id: z.string().uuid(),
            phoneNumber: z.string(),
            model: z.string().nullable(),
            notes: z.string().nullable(),
        })
        .nullable()
        .optional(),
    switch: z
        .object({
            id: z.string().uuid(),
            model: z.string(),
            vendor: z.string().nullable(),
            totalPorts: z.number(),
            mac: z.string().nullable(),
            notes: z.string().nullable(),
        })
        .nullable()
        .optional(),
    accessPoint: z
        .object({
            id: z.string().uuid(),
            model: z.string(),
            vendor: z.string().nullable(),
            mac: z.string().nullable(),
            notes: z.string().nullable(),
        })
        .nullable()
        .optional(),
});

export const UpdateAssetSchema = z.object({
    patrimony: emptyToNull.optional(),
    departmentId: emptyUuidToNull.optional(),
    locationId: emptyUuidToNull.optional(),
    newIpId: emptyUuidToNull.optional(),
    connectedToSwitchId: emptyUuidToNull.optional(),
    switchPort: emptyNumberToNull.optional(),
    computer: computerData.partial().optional(),
    printer: z
        .object({
            hostname: emptyToNull,
            model: emptyToNull,
            code: emptyToNull,
            serial: emptyToNull,
            notes: emptyToNull,
        })
        .partial()
        .optional(),
    phone: z
        .object({
            phoneNumber: emptyToNull,
            model: emptyToNull,
            notes: emptyToNull,
        })
        .partial()
        .optional(),
    camera: z
        .object({
            model: emptyToNull,
            serial: emptyToNull,
            mac: macSchema,
            notes: emptyToNull,
        })
        .partial()
        .optional(),
    switch: switchData.partial().optional(),
    accessPoint: accessPointData.partial().optional(),
});

export const AssetQuerySchema = z.object({
    departmentId: emptyUuidToNull.optional(),
    locationId: emptyUuidToNull.optional(),
    networkId: emptyUuidToNull.optional(),
    connectedToSwitchId: emptyUuidToNull.optional(),
    type: AssetTypeEnum.optional(),
    hasIp: z.enum(["true", "false"]).optional(),
    search: z.string().optional(),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(8),
});

export type CreateAssetInput = z.infer<typeof CreateAssetSchema>;
export type AssetResponse = z.infer<typeof AssetResponseSchema>;
export type UpdateAssetInput = z.infer<typeof UpdateAssetSchema>;
export type AssetQueryInput = z.infer<typeof AssetQuerySchema>;
