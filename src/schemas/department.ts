import { z } from "zod";

export const departmentSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Nome é obrigatório")
        .min(2, "Nome deve ter pelo menos 2 caracteres")
        .max(100, "Nome deve ter no máximo 100 caracteres"),
});

export const updateDepartmentSchema = departmentSchema.partial();

export type DepartmentSchemaInput = z.infer<typeof departmentSchema>;
