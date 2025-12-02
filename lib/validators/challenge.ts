import { z } from "zod";

/**
 * Challenge/Reading Goal validation schemas
 */

export const CreateChallengeSchema = z.object({
  type: z.enum(["BOOKS", "PAGES", "TIME"], {
    required_error: 'Veuillez sélectionner un type de challenge',
  }),
  target: z.number().min(1, "La cible doit être d'au moins 1"),
  deadline: z.date({
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

export const UpdateChallengeSchema = BaseUpdateChallengeSchema.refine(
  (data) => data.progress <= data.target,
  {
    message: "La progression ne peut pas dépasser la cible",
    path: ["progress"],
  }
);

export const GoalSchema = z.object({
  target: z.coerce.number().positive('L\'objectif doit être positif'),
  type: z.enum(['BOOKS', 'PAGES', 'TIME']),
  deadline: z.string().min(1, 'La date limite est requise'),
  progress: z.coerce.number().min(0).default(0),
  userId: z.string().min(1, 'L\'utilisateur est requis')
});
