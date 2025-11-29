import { z } from "zod";

/**
 * Book-related validation schemas
 */

export const BookSchema = z.object({
  key: z.string().min(1, 'La clé est requise'),
  title: z.string().min(1, 'Le titre est requis'),
  authors: z.string().min(1, 'Au moins un auteur est requis'),
  cover: z.string().url('URL de couverture invalide').optional().or(z.literal('')),
  numberOfPages: z.coerce.number().positive('Le nombre de pages doit être positif').optional()
});

export const PageNumberSchema = z.object({
  pageNumber: z.coerce.number().min(1, { message: "Le nombre de page est nécessaire" })
});
