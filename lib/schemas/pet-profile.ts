import { z } from "zod";

/**
 * Esquema del perfil de mascota.
 *
 * Pensado para perros en la primera versión del demo. Los campos opcionales
 * se mantienen ligeros para no fricionar la entrada de datos en la UI.
 */
export const petProfileSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(60, "El nombre es demasiado largo"),
  species: z.literal("dog"),
  breed: z.string().max(80).optional().or(z.literal("")),
  ageYears: z
    .coerce
    .number({ message: "Debe ser un número" })
    .min(0, "La edad no puede ser negativa")
    .max(40, "Edad fuera de rango")
    .optional(),
  weightKg: z
    .coerce
    .number({ message: "Debe ser un número" })
    .min(0, "El peso no puede ser negativo")
    .max(120, "Peso fuera de rango")
    .optional(),
  notes: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
});

export type PetProfileInput = z.infer<typeof petProfileSchema>;
