import { z } from "zod";

export const departmentSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
});
