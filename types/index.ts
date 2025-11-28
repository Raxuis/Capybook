import {BookNoteType, GoalType} from "@prisma/client";
import { z } from "zod";
import {NoteFormSchema} from "@/utils/zod";

export type Note = {
  id: string;
  title: string;
  content: string;
  page?: number;
  chapter?: string;
  tags: string[];
  type: BookNoteType;
  createdAt: string;
  updatedAt: string;
}


export type MoreInfoBook = Book & {
  description?: string;
  subjects: string[];
  cover?: string;
  finishedAt?: string | null;
  notes?: Note[];
}

export type Book = {
  id: string;
  key: string;
  title: string;
  cover_i?: number;
  cover?: string;
  author_name?: string[];
  first_publish_year?: number;
  language?: string[];
  authors?: string[];
  isbn?: string[];
  numberOfPages?: number;
};


export type Challenge = {
  id: string;
  type: GoalType;
  progress: number;
  target: number;
  deadline: Date;
  createdAt: Date;
  completedAt: Date | null;
}

export type ApiNote = {
  id: string;
  note: string;
  page?: number;
  chapter?: number;
  tags: string[];
  type: BookNoteType;
  createdAt: string;
  updatedAt: string;
  User: {
    name: string;
    username: string;
  };
  Book: {
    title: string;
  };
}

export type NoteFormData = z.infer<typeof NoteFormSchema>;

export type SortOption = 'createdAt' | 'page';

export interface BookNotesProps {
  book: MoreInfoBook;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userId: string;
}

export interface NotePayload {
  note: string;
  page?: string;
  chapter?: string;
  tags: string[];
  type: BookNoteType;
}