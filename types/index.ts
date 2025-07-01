import {GoalType} from "@prisma/client";
import {BookNotesConstants} from "@/constants/books/notes";


export type BookNoteType = (typeof BookNotesConstants)[keyof typeof BookNotesConstants];

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
