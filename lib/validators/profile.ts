import { z } from "zod";

/**
 * User profile validation schemas
 */

export const EditProfileSchema = z.object({
  username: z
    .string({ required_error: "Le pseudo est nécessaire" })
    .min(1, "Le pseudo est nécessaire")
    .max(15, "Le pseudo ne peut pas dépasser 15 caractères")
    .regex(/^[a-zA-Z0-9-]+$/, "Le pseudo ne peut contenir que des lettres, des chiffres et des tirets"),
  favoriteColor: z
    .string({ required_error: "La couleur préférée est nécessaire" })
    .regex(/^#[0-9A-F]{6}$/i, "La couleur préférée doit être en hexadécimal"),
});
