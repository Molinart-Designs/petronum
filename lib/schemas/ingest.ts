import { z } from "zod";

export const ingestSchema = z.object({
  title: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(120, "Máximo 120 caracteres"),
  content: z
    .string()
    .min(20, "Mínimo 20 caracteres")
    .max(10_000, "Contenido demasiado largo"),
  source_url: z
    .string()
    .url("URL inválida")
    .optional()
    .or(z.literal("")),
  tags: z.string().max(200).optional().or(z.literal("")),
});

export type IngestInput = z.infer<typeof ingestSchema>;
