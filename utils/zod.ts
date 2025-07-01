import z, { coerce, object, string, number, date } from "zod"

export const SignInSchema = object({
  email: string({ required_error: "L'email est nécessaire" })
    .min(1, "L'email est nécessaire")
    .email("Email invalide"),
  password: string({ required_error: "Le mot de passe est nécessaire" })
    .min(1, "Le mot de passe est nécessaire")
    .min(8, "Le mot de passe doit être d'au moins de 8 caractères")
    .max(32, "Le mot de passe ne peut pas accéder 32 caractères"),
})

export const SignUpSchema = object({
  username: string({ required_error: "Le pseudo est nécessaire" })
    .min(1, "Le pseudo est nécessaire")
    .max(15, "Le pseudo ne peut pas dépasser 15 caractères")
    .regex(/^[a-zA-Z0-9-]+$/, "Le pseudo ne peut contenir que des lettres, des chiffres et des tirets"),
  email: string({ required_error: "L'email est nécessaire" })
    .min(1, "L'email est nécessaire")
    .email("Email invalide"),
  password: string({ required_error: "Le mot de passe est nécessaire" })
    .min(1, "Le mot de passe est nécessaire")
    .min(8, "Le mot de passe doit être d'au moins de 8 caractères")
    .max(32, "Le mot de passe ne peut pas accéder 32 caractères"),
  favoriteColor: string({ required_error: "La couleur préférée est nécessaire" })
    .regex(/^#[0-9A-F]{6}$/i, "La couleur préférée doit être en hexadécimal"),
})

export const ReviewBookSchema = object({
  rating: string()
    .min(1, { message: "La note est nécessaire" })
    .regex(/^[1-5]$/, "La note doit être entre 1 et 5"),
  feedback: z
    .string()
    .max(500, "Le commentaire ne peut pas dépasser 500 caractères.")
    .optional()
    .transform((val) => val?.trim() || undefined)
});

export const PageNumberSchema = object({
  pageNumber: coerce.number()
    .min(1, { message: "Le nombre de page est nécessaire" })
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
  username: string({ required_error: "Le pseudo est nécessaire" })
    .min(1, "Le pseudo est nécessaire")
    .max(15, "Le pseudo ne peut pas dépasser 15 caractères")
    .regex(/^[a-zA-Z0-9-]+$/, "Le pseudo ne peut contenir que des lettres, des chiffres et des tirets"),
  favoriteColor: string({ required_error: "La couleur préférée est nécessaire" })
    .regex(/^#[0-9A-F]{6}$/i, "La couleur préférée doit être en hexadécimal"),
})


export const UserSchema = z.object({
  email: z.string().email('Email invalide'),
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  name: z.string().optional(),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').optional(),
  favoriteColor: z.string().default('#3b82f6'),
  role: z.enum(['USER', 'ADMIN', 'MODERATOR']).default('USER')
});

export const BookSchema = z.object({
  key: z.string().min(1, 'La clé est requise'),
  title: z.string().min(1, 'Le titre est requis'),
  authors: z.string().min(1, 'Au moins un auteur est requis'),
  cover: z.string().url('URL de couverture invalide').optional().or(z.literal('')),
  numberOfPages: z.coerce.number().positive('Le nombre de pages doit être positif').optional()
});

export const GenreSchema = z.object({
  name: z.string().min(1, 'Le nom du genre est requis')
});

export const BadgeSchema = z.object({
  name: z.string().min(1, 'Le nom du badge est requis'),
  ownerDescription: z.string().min(1, 'La description propriétaire est requise'),
  publicDescription: z.string().min(1, 'La description publique est requise'),
  category: z.enum(['BOOKS_READ', 'PAGES_READ', 'REVIEWS_WRITTEN', 'GOALS_COMPLETED', 'READING_STREAK', 'GENRE_EXPLORER', 'SPECIAL']),
  requirement: z.coerce.number().positive('Le requirement doit être positif'),
  icon: z.string().optional()
});

export const GoalSchema = z.object({
  target: z.coerce.number().positive('L\'objectif doit être positif'),
  type: z.enum(['BOOKS', 'PAGES', 'TIME']),
  deadline: z.string().min(1, 'La date limite est requise'),
  progress: z.coerce.number().min(0).default(0),
  userId: z.string().min(1, 'L\'utilisateur est requis')
});

export const noteFormSchema = z.object({
  title: z.string().min(1, 'Le titre est obligatoire').max(100),
  content: z.string().min(1, 'Le contenu est obligatoire').max(2000),
  page: z.string().optional().refine(
    (val) => !val || /^\d+$/.test(val),
    {
      message: 'La page doit être un nombre entier positif',
    }
  ),
  chapter: z.string().max(50).optional(),
  tags: z.string().optional().refine(
    (val) => !val || /^[a-zA-Z0-9, ]*$/.test(val),
    {
      message: 'Les tags ne peuvent contenir que des lettres, des chiffres et des virgules',
    }
  ),
  type: z.enum(['note', 'quote', 'thought'])
});
