import {object, string} from "zod"

export const SignInSchema = object({
    email: string({required_error: "L'email est nécessaire"})
        .min(1, "L'email est nécessaire")
        .email("Email invalide"),
    password: string({required_error: "Le mot de passe est nécessaire"})
        .min(1, "Le mot de passe est nécessaire")
        .min(8, "Le mot de passe doit être d'au moins de 8 caractères")
        .max(32, "Le mot de passe ne peut pas accéder 32 caractères"),
})

export const SignUpSchema = object({
    username: string({required_error: "Le pseudo est nécessaire"})
        .min(1, "Le pseudo est nécessaire")
        .max(15, "Le pseudo ne peut pas accéder 15 caractères"),
    email: string({required_error: "L'email est nécessaire"})
        .min(1, "L'email est nécessaire")
        .email("Email invalide"),
    password: string({required_error: "Le mot de passe est nécessaire"})
        .min(1, "Le mot de passe est nécessaire")
        .min(8, "Le mot de passe doit être d'au moins de 8 caractères")
        .max(32, "Le mot de passe ne peut pas accéder 32 caractères"),
})