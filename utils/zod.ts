import z, {coerce, object, string, number, date} from "zod"

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

export const ReviewBookSchema = object({
    rating: string()
        .min(1, {message: "La note est nécessaire"})
        .regex(/^[1-5]$/, "La note doit être entre 1 et 5"),
    feedback: string()
        .min(1, {message: "Le commentaire est nécessaire"})
        .max(500, {message: "Le commentaire ne peut pas dépasser 500 caractères"}),
});

export const PageNumberSchema = object({
    pageNumber: coerce.number()
        .min(1, {message: "Le nombre de page est nécessaire"})
})

export const ChallengeFormSchema = object({
    type: z.enum(["BOOKS", "PAGES", "TIME"]),
    target: number().min(1, "La cible doit être d'au moins 1"),
    deadline: date().min(new Date(), "La date limite doit être dans le futur"),
});