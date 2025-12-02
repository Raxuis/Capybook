import { z } from "zod";

/**
 * Book review validation schemas
 */

export const ReviewBookSchema = z.object({
  rating: z
    .string()
    .min(1, { message: "La note est nécessaire" })
    .regex(/^[1-5]$/, "La note doit être entre 1 et 5"),
  feedback: z
    .string()
    .max(500, "Le commentaire ne peut pas dépasser 500 caractères.")
    .optional()
    .transform((val) => val?.trim() || undefined),
});
