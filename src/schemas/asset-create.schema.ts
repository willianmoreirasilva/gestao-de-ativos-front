import * as z from "zod";

export const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
export const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

export const lenientOptionalString = z
    .union([z.string(), z.null(), z.undefined()])
    .optional();

export const nullableString = z
    .union([z.string(), z.null(), z.undefined()])
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null));

// 1. Schema Base (Campos comuns de Alocação, Switch e IP)
const baseAssetObject = {
    // Alocação
    departmentId: lenientOptionalString,
    unitId: lenientOptionalString,
    locationId: lenientOptionalString,
    patrimony: lenientOptionalString,
    username: lenientOptionalString,
    userId: lenientOptionalString,

    // Conectividade (Switch)
    switchId: lenientOptionalString,
    switchPort: lenientOptionalString,

    // Gerenciamento de IP
    isManualMode: z.boolean().default(false),
    manualIpValue: lenientOptionalString,
    selectedNetworkId: lenientOptionalString,
    selectedIpId: lenientOptionalString,
};

// Refinação lógica compartilhada (Alocação, IP e Switch)
const refineAssetBase = (data: any, ctx: z.RefinementCtx) => {
    const hasDepartment = Boolean(
        data.departmentId && data.departmentId.trim() !== "",
    );
    const hasUnit = Boolean(
        (data.unitId && data.unitId.trim() !== "") ||
        (data.locationId && data.locationId.trim() !== ""),
    );

    if (!hasDepartment && !hasUnit) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Selecione ao menos um: Departamento ou Localidade.",
            path: ["departmentId"],
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Selecione ao menos um: Localidade ou Departamento.",
            path: ["unitId"],
        });
    }

    if (data.isManualMode && data.manualIpValue) {
        if (!ipv4Regex.test(data.manualIpValue.trim())) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Endereço IPv4 inválido (Ex: 192.168.1.15).",
                path: ["manualIpValue"],
            });
        }
    }

    if (
        !data.isManualMode &&
        data.selectedNetworkId &&
        data.selectedNetworkId !== "" &&
        data.selectedNetworkId !== "REMOVE_IP"
    ) {
        if (!data.selectedIpId || data.selectedIpId.trim() === "") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Selecione um endereço IP disponível.",
                path: ["selectedIpId"],
            });
        }
    }

    // Validação da porta do switch (Pertence à entidade Asset)
    const hasSwitch = Boolean(data.switchId && data.switchId.trim() !== "");
    const rawPort = data.switchPort ? `${data.switchPort}`.trim() : "";
    const hasPort = Boolean(rawPort !== "");

    if (hasSwitch && !hasPort) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Informe a porta do switch.",
            path: ["switchPort"],
        });
    }

    if (hasPort) {
        if (!hasSwitch) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Selecione o switch correspondente à porta.",
                path: ["switchId"],
            });
        }

        const portNumber = Number(rawPort);

        if (
            !/^\d+$/.test(rawPort) ||
            isNaN(portNumber) ||
            portNumber <= 0 ||
            portNumber > 128
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "A porta deve ser um número inteiro entre 1 e 128.",
                path: ["switchPort"],
            });
        }
    }
};

// 2. Schema de Computadores
export const computerFormSchema = z
    .object({
        hostname: z
            .string()
            .trim()
            .min(1, "O Hostname é obrigatório")
            .max(63, "Hostname muito longo"),

        processorId: lenientOptionalString,
        memory: lenientOptionalString,
        diskId: lenientOptionalString,
        osId: lenientOptionalString,
        anydesk: lenientOptionalString,
        notes: lenientOptionalString,

        mac: lenientOptionalString.refine(
            (val) => !val || macRegex.test(val),
            "Endereço MAC inválido. Ex: 00:1A:3F:F1:4C:C2",
        ),

        ...baseAssetObject,
    })
    .superRefine(refineAssetBase);

// 3. Schema de Impressoras
export const printerFormSchema = z
    .object({
        model: z.string().trim().min(1, "O modelo da impressora é obrigatório"),
        serial: lenientOptionalString,
        code: lenientOptionalString,
        notes: lenientOptionalString,

        ...baseAssetObject,
    })
    .superRefine(refineAssetBase);

// 4. Schema de Câmeras
export const cameraFormSchema = z
    .object({
        // 📹 Hostname agora é OPCIONAL (alinhado com o backend)
        hostname: lenientOptionalString.refine(
            (val) => !val || val.length <= 63,
            "Hostname muito longo (máximo de 63 caracteres)",
        ),

        // 📹 Model agora é OBRIGATÓRIO (alinhado com o backend)
        model: z.string().trim().min(1, "O modelo da câmera é obrigatório"),

        channel: lenientOptionalString.refine(
            (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
            "O canal deve ser um número maior que 0",
        ),
        serial: lenientOptionalString,
        mac: lenientOptionalString.refine(
            (val) => !val || macRegex.test(val),
            "Endereço MAC inválido. Ex: 00:1A:3F:F1:4C:C2",
        ),
        notes: lenientOptionalString,

        ...baseAssetObject,
    })
    .superRefine(refineAssetBase);

// 5. Schema de Telefones / Ramais
export const phoneFormSchema = z
    .object({
        hostname: z
            .string()
            .trim()
            .min(1, "O hostname do telefone é obrigatório")
            .max(63, "Hostname muito longo"),
        phoneNumber: z
            .string()
            .trim()
            .min(1, "O número de telefone / ramal é obrigatório"),
        model: lenientOptionalString,
        notes: lenientOptionalString,

        ...baseAssetObject,
    })
    .superRefine(refineAssetBase);

// Refinação específica para Switches e Access Points (valida IP e Alocação, mas IGNORA exigência de porta de switch)
const refineSwitchBase = (data: any, ctx: z.RefinementCtx) => {
    // 1. Validação de Alocação (ao menos Departamento ou Localidade)
    const hasDepartment = Boolean(
        data.departmentId && data.departmentId.trim() !== "",
    );
    const hasUnit = Boolean(
        (data.unitId && data.unitId.trim() !== "") ||
        (data.locationId && data.locationId.trim() !== ""),
    );

    if (!hasDepartment && !hasUnit) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Selecione ao menos um: Departamento ou Localidade.",
            path: ["departmentId"],
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Selecione ao menos um: Localidade ou Departamento.",
            path: ["unitId"],
        });
    }

    // 2. Validação de IP (Manual ou Selecionado)
    if (data.isManualMode && data.manualIpValue) {
        if (!ipv4Regex.test(data.manualIpValue.trim())) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Endereço IPv4 inválido (Ex: 192.168.1.15).",
                path: ["manualIpValue"],
            });
        }
    }

    if (
        !data.isManualMode &&
        data.selectedNetworkId &&
        data.selectedNetworkId !== "" &&
        data.selectedNetworkId !== "REMOVE_IP"
    ) {
        if (!data.selectedIpId || data.selectedIpId.trim() === "") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Selecione um endereço IP disponível.",
                path: ["selectedIpId"],
            });
        }
    }
};

// 6. Schema de Switches
export const switchFormSchema = z
    .object({
        hostname: lenientOptionalString.refine(
            (val) => !val || val.length <= 63,
            "Hostname muito longo (máximo de 63 caracteres)",
        ),
        model: z.string().trim().min(1, "O modelo do switch é obrigatório"),
        vendor: lenientOptionalString,
        totalPorts: z
            .union([z.string(), z.number()])
            .transform((val) => Number(val) || 24)
            .pipe(z.number().min(1, "O total de portas deve ser no mínimo 1")),

        mac: lenientOptionalString.refine(
            (val) => !val || macRegex.test(val),
            "Endereço MAC inválido. Ex: 00:1A:3F:F1:4C:C2",
        ),
        notes: lenientOptionalString,

        ...baseAssetObject,
    })
    .superRefine(refineSwitchBase);

// 7. Schema de Access Points
export const accessPointFormSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, "O nome do Access Point é obrigatório")
            .max(63, "Nome muito longo (máximo de 63 caracteres)"),
        model: z
            .string()
            .trim()
            .min(1, "O modelo do Access Point é obrigatório"),
        vendor: lenientOptionalString,
        ssid: lenientOptionalString,
        wifiPassword: lenientOptionalString,
        securityType: lenientOptionalString,
        frequencyBand: lenientOptionalString,
        adminUsername: lenientOptionalString,
        adminPassword: lenientOptionalString,
        firmwareVersion: lenientOptionalString,

        mac: lenientOptionalString.refine(
            (val) => !val || macRegex.test(val),
            "Endereço MAC inválido. Ex: 00:1A:3F:F1:4C:C2",
        ),
        notes: lenientOptionalString,

        ...baseAssetObject,
    })
    .superRefine(refineSwitchBase);

// Export das Tipagens
export type ComputerFormValues = z.infer<typeof computerFormSchema>;
export type PrinterFormValues = z.infer<typeof printerFormSchema>;
export type CameraFormValues = z.infer<typeof cameraFormSchema>;
export type PhoneFormValues = z.infer<typeof phoneFormSchema>;
export type SwitchFormValues = z.infer<typeof switchFormSchema>;
export type AccessPointFormValues = z.infer<typeof accessPointFormSchema>;
