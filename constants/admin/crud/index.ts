import {Award, Book, Tag, Target, User} from "lucide-react";
import {
    createBadge,
    createBook, createGenre,
    createUser, deleteBadge,
    deleteBook, deleteGenre,
    deleteUser, getAllReadingGoals, getBadges,
    getBooks, getGenres,
    getUsers, updateBadge,
    updateBook, updateGenre,
    updateUser
} from "@/actions/admin/crud";
import {
    BadgeEntity, BadgeFormData,
    BookEntity, BookFormData,
    EntityConfiguration,
    GenreEntity, GenreFormData,
    GoalEntity, GoalFormData, ServerActions,
    UserEntity,
    UserFormData
} from "@/types/admin/crud";
import {BadgeSchema, BookSchema, GenreSchema, GoalSchema, UserSchema} from "@/lib/validators";

export const entityConfig = {
    users: {
        title: 'Utilisateurs',
        icon: User,
        schema: UserSchema,
        fields: [
            {name: 'email', label: 'Email', type: 'email' as const},
            {name: 'username', label: 'Nom d\'utilisateur', type: 'text' as const},
            {name: 'password', label: 'Mot de passe', type: 'password' as const},
            {name: 'favoriteColor', label: 'Couleur favorite', type: 'color' as const},
            {name: 'role', label: 'Rôle', type: 'select' as const, options: ['USER', 'ADMIN', 'MODERATOR']}
        ],
        displayFields: ['email', 'username', 'role'] as Array<keyof UserEntity>
    } satisfies EntityConfiguration<typeof UserSchema, UserEntity>,

    books: {
        title: 'Livres',
        icon: Book,
        schema: BookSchema,
        fields: [
            {name: 'key', label: 'Clé', type: 'text' as const},
            {name: 'title', label: 'Titre', type: 'text' as const},
            {name: 'authors', label: 'Auteurs (séparés par des virgules)', type: 'text' as const},
            {name: 'cover', label: 'URL de la couverture', type: 'url' as const},
            {name: 'numberOfPages', label: 'Nombre de pages', type: 'number' as const}
        ],
        displayFields: ['title', 'authors', 'numberOfPages'] as Array<keyof BookEntity>
    } satisfies EntityConfiguration<typeof BookSchema, BookEntity>,

    genres: {
        title: 'Genres',
        icon: Tag,
        schema: GenreSchema,
        fields: [
            {name: 'name', label: 'Nom du genre', type: 'text' as const}
        ],
        displayFields: ['name'] as Array<keyof GenreEntity>
    } satisfies EntityConfiguration<typeof GenreSchema, GenreEntity>,

    badges: {
        title: 'Badges',
        icon: Award,
        schema: BadgeSchema,
        fields: [
            {name: 'name', label: 'Nom', type: 'text' as const},
            {name: 'ownerDescription', label: 'Description propriétaire', type: 'textarea' as const},
            {name: 'publicDescription', label: 'Description publique', type: 'textarea' as const},
            {
                name: 'category',
                label: 'Catégorie',
                type: 'select' as const,
                options: ['BOOKS_READ', 'PAGES_READ', 'REVIEWS_WRITTEN', 'GOALS_COMPLETED', 'READING_STREAK', 'GENRE_EXPLORER', 'SPECIAL']
            },
            {name: 'requirement', label: 'Requirement', type: 'number' as const},
            {name: 'icon', label: 'Icône', type: 'text' as const}
        ],
        displayFields: ['name', 'category', 'requirement'] as Array<keyof BadgeEntity>
    } satisfies EntityConfiguration<typeof BadgeSchema, BadgeEntity>,

    goals: {
        title: 'Objectifs',
        icon: Target,
        schema: GoalSchema,
        fields: [
            {name: 'target', label: 'Objectif', type: 'number' as const},
            {name: 'type', label: 'Type', type: 'select' as const, options: ['BOOKS', 'PAGES', 'TIME']},
            {name: 'deadline', label: 'Date limite', type: 'date' as const},
            {name: 'progress', label: 'Progrès', type: 'number' as const},
            {name: 'userId', label: 'ID Utilisateur', type: 'text' as const}
        ],
        displayFields: ['target', 'type', 'deadline', 'progress'] as Array<keyof GoalEntity>
    } satisfies EntityConfiguration<typeof GoalSchema, GoalEntity>
};

export const serverActions = {
    users: {
        get: getUsers,
        create: createUser,
        update: updateUser,
        delete: deleteUser
    } as unknown as ServerActions<UserFormData, UserEntity>,

    books: {
        get: getBooks,
        create: createBook,
        update: updateBook,
        delete: deleteBook
    } as unknown as ServerActions<BookFormData, BookEntity>,

    genres: {
        get: getGenres,
        create: createGenre,
        update: updateGenre,
        delete: deleteGenre
    } as unknown as ServerActions<GenreFormData, GenreEntity>,

    badges: {
        get: getBadges,
        create: createBadge,
        update: updateBadge,
        delete: deleteBadge
    } as unknown as ServerActions<BadgeFormData, BadgeEntity>,

    goals: {
        get: getAllReadingGoals,
        create: null,
        update: null,
        delete: null
    } as ServerActions<GoalFormData, GoalEntity>
};
