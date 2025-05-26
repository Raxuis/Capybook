import {z} from "zod";
import {LucideIcon} from "lucide-react";
import {
    UserSchema,
    BookSchema,
    GenreSchema,
    BadgeSchema,
    GoalSchema
} from '@/utils/zod';

export type EntitySlug = 'users' | 'books' | 'genres' | 'badges' | 'goals';

export type UserFormData = z.infer<typeof UserSchema>;
export type BookFormData = z.infer<typeof BookSchema>;
export type GenreFormData = z.infer<typeof GenreSchema>;
export type BadgeFormData = z.infer<typeof BadgeSchema>;
export type GoalFormData = z.infer<typeof GoalSchema>;

export interface UserEntity {
    id: string;
    email: string;
    username: string;
    image?: string | null;
    role: string;
    name?: string | null;

    [key: string]: unknown;
}

export interface BookEntity {
    id: string;
    key: string;
    title: string;
    authors: string[];
    cover: string | null;
    numberOfPages: number | null;

    [key: string]: unknown;
}

export interface GenreEntity {
    id: string;
    name: string;

    [key: string]: unknown;
}

export interface BadgeEntity {
    id: string;
    name: string;
    ownerDescription: string;
    publicDescription: string;
    category: string;
    requirement: number;
    icon: string | null;

    [key: string]: unknown;
}

export interface GoalEntity {
    id: string;
    userId: string;
    target: number;
    type: string;
    deadline: Date | string;
    progress: number;
    completedAt?: Date | null;

    [key: string]: unknown;
}

export type EntityData = UserEntity | BookEntity | GenreEntity | BadgeEntity | GoalEntity;

export type FormData = UserFormData | BookFormData | GenreFormData | BadgeFormData | GoalFormData;

export interface FormFieldType {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'number' | 'date' | 'url' | 'color';
    options?: string[];
}

export interface EntityConfiguration<TSchema extends z.ZodType<unknown>, TEntity extends { id: string }> {
    title: string;
    icon: LucideIcon;
    schema: TSchema;
    fields: FormFieldType[];
    displayFields: Array<keyof TEntity>;
}

export interface ServerActions<TData, TEntity> {
    get: (() => Promise<TEntity[]>) | ((userId: string) => Promise<TEntity[]>) | null;
    create: ((data: TData) => Promise<TEntity>) | null;
    update: ((id: string, data: Partial<TData>) => Promise<TEntity>) | null;
    delete: ((id: string) => Promise<void>) | null;
}