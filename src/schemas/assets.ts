import { z } from "zod";

export const assetBaseSchema = z.object({
    patrimony: z.string().nullable().optional(),
    type: z.enum(["COMPUTER", "PRINTER", "PHONE", "CAMERA", "SWITCH", "AP"]),
    departmentId: z.string().min(1, "Selecione um departamento"),
    locationId: z.string().min(1, "Selecione um local"),
    ipId: z.string().nullable().optional(),
});

// 🎥 1. CAMERA
export const cameraSchema = z.object({
    model: z.string().min(2, "O modelo da câmera é obrigatório"),
    serial: z.string().nullable().optional(),
    mac: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
});

export const cameraAssetFormSchema = assetBaseSchema.extend({
    camera: cameraSchema,
});
export type CameraAssetFormValues = z.infer<typeof cameraAssetFormSchema>;

// 🖨️ 2. PRINTER
export const printerSchema = z.object({
    model: z.string().min(2, "O modelo da impressora é obrigatório"),
    hostname: z.string().nullable().optional(),
    code: z.string().nullable().optional(),
    serial: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
});

export const printerAssetFormSchema = assetBaseSchema.extend({
    printer: printerSchema,
});
export type PrinterAssetFormValues = z.infer<typeof printerAssetFormSchema>;

// 📞 3. PHONE (VoIP)
export const phoneSchema = z.object({
    phoneNumber: z.string().min(2, "O número ou ramal é obrigatório"),
    model: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
});

export const phoneAssetFormSchema = assetBaseSchema.extend({
    phone: phoneSchema,
});
export type PhoneAssetFormValues = z.infer<typeof phoneAssetFormSchema>;

// 🌐 4. NETWORK DEVICE (Switches, Routers, APs)
export const networkDeviceSchema = z.object({
    model: z.string().nullable().optional(),
    mac: z.string().nullable().optional(),
    vendor: z.string().nullable().optional(), // Fabricante (Cisco, Ubiquiti, etc.)
    notes: z.string().nullable().optional(),
});

export const networkDeviceAssetFormSchema = assetBaseSchema.extend({
    networkDevice: networkDeviceSchema,
});

// Helper para strings comuns: Transforma string vazia ("") em null de forma limpa
const emptyToNull = z.preprocess(
    (val) =>
        val === "" || val === undefined || val === null || val === "null"
            ? null
            : val,
    z.string().nullable(),
);

// 🌟 HELPER BLINDADO PARA UUIDs OPCIONAIS:
// Se for uma string vazia, vira null IMEDIATAMENTE e ignora a validação de UUID.
const emptyUuidToNull = z.preprocess(
    (val) => {
        if (val === "" || val === undefined || val === null || val === "null") {
            return null;
        }
        return val;
    },
    z.union([z.string().uuid("UUID Inválido"), z.null()]),
);
export const UpdateAssetSchema = z.object({
    patrimony: emptyToNull.optional(),
    departmentId: emptyUuidToNull.optional(),
    locationId: emptyUuidToNull.optional(),
    newIpId: emptyUuidToNull.optional(),

    computer: z
        .object({
            hostname: z.string().min(1, "Hostname é obrigatório").optional(),
            username: z.string().min(1, "Usuário é obrigatório").optional(),

            // 🌟 Agora o processador, disk e osId aceitam string vazia que vira null sem dar erro de UUID!
            memory: emptyToNull.optional(),
            processorId: emptyUuidToNull.optional(),
            diskId: emptyUuidToNull.optional(),
            osId: emptyUuidToNull.optional(),
            mac: emptyToNull.optional(),
        })
        .optional(),

    printer: z
        .object({
            hostname: emptyToNull,
            model: emptyToNull,
            code: emptyToNull,
            serial: emptyToNull,
            notes: emptyToNull,
        })
        .nullable()
        .optional(),

    phone: z
        .object({
            phoneNumber: emptyToNull,
            model: emptyToNull,
            notes: emptyToNull,
        })
        .nullable()
        .optional(),

    camera: z
        .object({
            model: emptyToNull,
            serial: emptyToNull,
            mac: emptyToNull,
            notes: emptyToNull,
        })
        .nullable()
        .optional(),

    networkDevice: z
        .object({
            mac: emptyToNull,
            model: emptyToNull,
            vendor: emptyToNull,
            notes: emptyToNull,
        })
        .nullable()
        .optional(),
});

export type NetworkDeviceAssetFormValues = z.infer<
    typeof networkDeviceAssetFormSchema
>;
export type UpdateAssetInput = z.infer<typeof UpdateAssetSchema>;
