import { z } from "zod";

/**
 * Admin CRUD validation schemas
 */

export const UserSchema = z.object({
  email: z.string().email('Email invalide'),
  username: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  name: z.string().optional(),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').optional(),
  favoriteColor: z.string().default('#3b82f6'),
  role: z.enum(['USER', 'ADMIN', 'MODERATOR']).default('USER')
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
