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
export type NetworkDeviceAssetFormValues = z.infer<
    typeof networkDeviceAssetFormSchema
>;
