import { z } from "zod";
import { BookNoteType } from "@prisma/client";

/**
 * Book note validation schemas
 */

export const NoteFormSchema = z.object({
  note: z.string().min(1, 'Le contenu de la note est requis'),
  page: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+$/.test(val),
      {
        message: 'La page doit être un nombre entier positif',
      }
    ),
  chapter: z
    .string()
    .max(50)
    .optional()
    .refine(
      (val) => !val || /^[a-zA-Z0-9 ]*$/.test(val),
      {
        message: 'Le chapitre ne peut contenir que des lettres, des chiffres et des espaces',
      }
    ),
  tags: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[a-zA-Z0-9, ]*$/.test(val),
      {
        message: 'Les tags ne peuvent contenir que des lettres, des chiffres et des virgules',
      }
    ),
  type: z.nativeEnum(BookNoteType).optional(),
});
