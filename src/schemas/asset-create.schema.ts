import * as z from "zod";

// Helper para tratar strings nulas/vazias sem estourar o Zod
const nullableString = z
    .union([z.string(), z.null(), z.undefined()])
    .transform((val) => (val && val.trim() !== "" ? val.trim() : null));

/**
 * 1. Schema da Server Action (Backend / API)
 */
export const createAssetSchema = z.object({
    category: z.string().default("COMPUTER"),

    // Especificações
    hostname: z
        .string({ required_error: "O Hostname é obrigatório." })
        .trim()
        .min(1, "O Hostname é obrigatório para o cadastro."),
    os: nullableString,
    cpu: nullableString,
    ram: nullableString,
    storage: nullableString,
    macAddress: nullableString,
    notes: nullableString,

    // Conectividade
    ipId: nullableString,
    switchId: nullableString,
    switchPort: z.coerce.number().nullable().optional(),

    // Alocação & Responsabilidades
    patrimony: nullableString,
    username: nullableString,
    departmentId: nullableString,
    locationId: nullableString, // Backend mapeia como locationId
});

const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

// Helper tolerante: Aceita string, null ou undefined e não estoura erro de tipo no Client
const lenientOptionalString = z
    .union([z.string(), z.null(), z.undefined()])
    .optional();

export const computerFormSchema = z
    .object({
        // Único campo de texto estritamente obrigatório
        hostname: z
            .string({ required_error: "O Hostname é obrigatório" })
            .trim()
            .min(1, "O Hostname é obrigatório")
            .max(63, "Hostname muito longo"),

        // Alocação & Responsabilidades
        departmentId: lenientOptionalString,
        unitId: lenientOptionalString,
        locationId: lenientOptionalString,
        patrimony: lenientOptionalString,
        username: lenientOptionalString,
        userId: lenientOptionalString,

        // Especificações
        processorId: lenientOptionalString,
        memory: lenientOptionalString,
        diskId: lenientOptionalString,
        osId: lenientOptionalString,
        notes: lenientOptionalString,

        // Validação de MAC
        mac: lenientOptionalString.refine(
            (val) => !val || macRegex.test(val),
            "Endereço MAC inválido. Ex: 00:1A:3F:F1:4C:C2",
        ),

        // Conectividade
        switchId: lenientOptionalString,
        switchPort: lenientOptionalString,

        // Gerenciamento de IP
        isManualMode: z.boolean().default(false),
        manualIpValue: lenientOptionalString,
        selectedNetworkId: lenientOptionalString,
        selectedIpId: lenientOptionalString,
    })
    .superRefine((data, ctx) => {
        // 1. REGRA DE ALOCAÇÃO: Exige APENAS UM (Departamento OU Localidade/Unit)
        const hasDepartment = Boolean(
            data.departmentId && data.departmentId.trim() !== "",
        );
        const hasUnit = Boolean(
            (data.unitId && data.unitId.trim() !== "") ||
            (data.locationId && data.locationId.trim() !== ""),
        );

        // Se NÃO tiver nenhum dos dois, aí sim gera o erro
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

        // 2. REGRA DE IP MANUAL
        if (data.isManualMode && data.manualIpValue) {
            if (!ipv4Regex.test(data.manualIpValue.trim())) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Endereço IPv4 inválido (Ex: 192.168.1.15).",
                    path: ["manualIpValue"],
                });
            }
        }

        // 3. REGRA DE IP AUTOMÁTICO
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

        // 4. REGRA DE CONEXÃO SWITCH / PORTA
        const hasSwitch = Boolean(data.switchId && data.switchId.trim() !== "");
        const hasPort = Boolean(
            data.switchPort && `${data.switchPort}`.trim() !== "",
        );

        if (hasSwitch && !hasPort) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Informe a porta do switch.",
                path: ["switchPort"],
            });
        }

        if (hasPort && !hasSwitch) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Selecione o switch correspondente à porta.",
                path: ["switchId"],
            });
        }
    });

export type ComputerFormValues = z.infer<typeof computerFormSchema>;
export type CreateAssetFormValues = z.infer<typeof createAssetSchema>;
