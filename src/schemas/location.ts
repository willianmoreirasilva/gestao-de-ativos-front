import { z } from "zod";

export const locationSchema = z.object({
    name: z.string().min(2, "nome deve ter pelo menos 2 caracteres"),
    building: z.string().nullable(),
    floor: z.string().nullable(),
    room: z.string().nullable(),
    notes: z.string().nullable(),
});