import { z } from "zod";

export const filterOperatorSchema = z.enum([
    "eq", // Igual
    "neq", // Diferente
    "contains", // Contém (insensível a maiúsculas/minúsculas)
    "startsWith", // Começa com
    "gt", // Maior que
    "gte", // Maior ou igual
    "lt", // Menor que
    "lte", // Menor ou igual
    "in", // Múltipla seleção / Pertence a
    "isNull", // Está sem valor (null)
    "isNotNull", // Está preenchido
]);

export const singleFilterSchema = z.object({
    field: z.string(),
    operator: filterOperatorSchema,
    value: z.any().optional(),
});

export const reportQuerySchema = z.object({
    filters: z.array(singleFilterSchema).default([]),
    groupBy: z
        .enum(["none", "department", "location", "network", "type"])
        .default("none"),
    columns: z.array(z.string()).min(1),
    orderBy: z.object({
        field: z.string().default("createdAt"),
        direction: z.enum(["asc", "desc"]).default("desc"),
    }),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type FilterOperator = z.infer<typeof filterOperatorSchema>;
export type SingleFilterInput = z.infer<typeof singleFilterSchema>;
export type ReportQueryInput = z.infer<typeof reportQuerySchema>;
