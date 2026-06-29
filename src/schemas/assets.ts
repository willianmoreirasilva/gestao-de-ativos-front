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

export const UpdateAssetSchema = z.object({
  patrimony: z.string().optional(),
  departmentId: z.string().uuid().optional(),
  locationId: z.string().uuid().optional(),
  newIpId: z.string().uuid().nullable().optional(),
  computer: z.object({
    hostname: z.string(),
    username: z.string(),
    processor: z.string().nullable(),
    memory: z.string().nullable(),
  }).optional(),
  printer: z.object({
    hostname: z.string().nullable(),
    model: z.string(),
    code: z.string(),
    serial: z.string(),
    notes: z.string(),
  }).nullable().optional(),
  phone: z.object({
    phoneNumber: z.string(),
    model: z.string(),
    notes: z.string(),
  }).nullable().optional(),
  camera: z.object({
    model: z.string(),
    serial: z.string(),
    mac: z.string(),
    notes: z.string(),
  }).nullable().optional(),
  networkDevice: z.object({
    mac: z.string(),
    model: z.string(),
    vendor: z.string(),
    notes: z.string(),
  }).nullable().optional(),
});



export type NetworkDeviceAssetFormValues = z.infer<
    typeof networkDeviceAssetFormSchema
>;
export type UpdateAssetInput = z.infer<typeof UpdateAssetSchema>;