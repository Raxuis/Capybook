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
        .max(15, "Le pseudo ne peut pas dépasser 15 caractères")
        .regex(/^[a-zA-Z0-9-]+$/, "Le pseudo ne peut contenir que des lettres, des chiffres et des tirets"),
    email: string({required_error: "L'email est nécessaire"})
        .min(1, "L'email est nécessaire")
        .email("Email invalide"),
    password: string({required_error: "Le mot de passe est nécessaire"})
        .min(1, "Le mot de passe est nécessaire")
        .min(8, "Le mot de passe doit être d'au moins de 8 caractères")
        .max(32, "Le mot de passe ne peut pas accéder 32 caractères"),
    favoriteColor: string({required_error: "La couleur préférée est nécessaire"})
        .regex(/^#[0-9A-F]{6}$/i, "La couleur préférée doit être en hexadécimal"),
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

export const CreateChallengeSchema = object({
    type: z.enum(["BOOKS", "PAGES", "TIME"], {
        required_error: 'Veuillez sélectionner un type de challenge',
    }),
    target: number().min(1, "La cible doit être d'au moins 1"),
    deadline: date({
        required_error: 'Veuillez sélectionner une date limite',
    }).min(new Date(), "La date limite doit être dans le futur"),
});

export const BaseUpdateChallengeSchema = z.object({
    type: z.enum(['BOOKS', 'PAGES', 'TIME'], {
        required_error: 'Veuillez sélectionner un type de challenge',
    }),
    target: z.coerce.number().positive({
        message: 'La cible doit être un nombre positif',
    }),
    progress: z.coerce.number().min(0, {
        message: 'La progression ne peut pas être négative',
    }),
    deadline: z.date({
        required_error: 'Veuillez sélectionner une date limite',
    }),
});

export const UpdateChallengeSchema = BaseUpdateChallengeSchema.refine((data) => data.progress <= data.target, {
    message: "La progression ne peut pas dépasser la cible",
    path: ["progress"],
});

export const EditProfileSchema = object({
    username: string({required_error: "Le pseudo est nécessaire"})
        .min(1, "Le pseudo est nécessaire")
        .max(15, "Le pseudo ne peut pas dépasser 15 caractères")
        .regex(/^[a-zA-Z0-9-]+$/, "Le pseudo ne peut contenir que des lettres, des chiffres et des tirets"),
    favoriteColor: string({required_error: "La couleur préférée est nécessaire"})
        .regex(/^#[0-9A-F]{6}$/i, "La couleur préférée doit être en hexadécimal"),
})