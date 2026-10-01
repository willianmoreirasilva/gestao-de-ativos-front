import { z } from "zod";

export const findAvailableIpsSchema = z.object({
    networkId: z.string().min(1, "Selecione uma rede/VLAN"),
    quantity: z
        .number({ error: "Informe um número válido" })
        .int("A quantidade deve ser um número inteiro")
        .min(1, "Solicite pelo menos 1 IP")
        .max(256, "No máximo 256 IPs por consulta"),
});

export type FindAvailableIpsInput = z.infer<typeof findAvailableIpsSchema>;

export const reserveIpsSchema = z.object({
    networkId: z.string().min(1, "ID da rede é obrigatório"),
    ipAddresses: z
        .array(z.ipv4("Insira um endereço IPv4 válido"))
        .min(1, "Selecione pelo menos um IP"),
    reason: z.string().nullable().optional(),
});

export type ReserveIpsInput = z.infer<typeof reserveIpsSchema>;
