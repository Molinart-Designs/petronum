import { z } from "zod";

export const querySchema = z.object({
  question: z
    .string()
    .min(5, "Escribe al menos 5 caracteres")
    .max(500, "Máximo 500 caracteres"),
});

export type QueryInput = z.infer<typeof querySchema>;
