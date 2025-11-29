import { z } from "zod";

/**
 * Authentication validation schemas
 */

export const SignInSchema = z.object({
  email: z
    .string({ required_error: "L'email est nécessaire" })
    .min(1, "L'email est nécessaire")
    .email("Email invalide"),
  password: z
    .string({ required_error: "Le mot de passe est nécessaire" })
    .min(1, "Le mot de passe est nécessaire")
    .min(8, "Le mot de passe doit être d'au moins de 8 caractères")
    .max(32, "Le mot de passe ne peut pas accéder 32 caractères"),
});

export const SignUpSchema = z.object({
  username: z
    .string({ required_error: "Le pseudo est nécessaire" })
    .min(1, "Le pseudo est nécessaire")
    .max(15, "Le pseudo ne peut pas dépasser 15 caractères")
    .regex(/^[a-zA-Z0-9-]+$/, "Le pseudo ne peut contenir que des lettres, des chiffres et des tirets"),
  email: z
    .string({ required_error: "L'email est nécessaire" })
    .min(1, "L'email est nécessaire")
    .email("Email invalide"),
  password: z
    .string({ required_error: "Le mot de passe est nécessaire" })
    .min(1, "Le mot de passe est nécessaire")
    .min(8, "Le mot de passe doit être d'au moins de 8 caractères")
    .max(32, "Le mot de passe ne peut pas accéder 32 caractères"),
  favoriteColor: z
    .string({ required_error: "La couleur préférée est nécessaire" })
    .regex(/^#[0-9A-F]{6}$/i, "La couleur préférée doit être en hexadécimal"),
});
