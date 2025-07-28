import prisma from "@/utils/prisma";
import {ValidationError} from "@/utils/api-validation";
import type {Prisma} from '@prisma/client';

export type UserBookWithRelations = Prisma.UserBookGetPayload<{
    include: {
        Book: true;
        User: {
            select: {
                id: true;
                name: true;
                username: true;
            }
        }
    }
}>;

export type BookNoteWithRelations = Prisma.UserBookNotesGetPayload<{
    include: {
        User: {
            select: {
                name: true;
                username: true;
            }
        };
        Book: {
            select: {
                title: true;
            }
        };
    }
}>;

export type UserWithoutPassword = Omit<Prisma.UserGetPayload<{}>, 'password'>;

// =============== FONCTIONS BOOK ===============

/**
 * Récupère un livre par son ID
 */
export async function getBookById(bookId: string) {
    const book = await prisma.book.findUnique({
        where: {id: bookId}
    });

    if (!book) {
        throw new ValidationError("Aucun livre trouvé avec cet ID", 404);
    }

    return book;
}

/**
 * Récupère un livre par sa clé
 */
export async function getBookByKey(bookKey: string) {
    const book = await prisma.book.findUnique({
        where: {key: bookKey}
    });

    if (!book) {
        throw new ValidationError("Aucun livre trouvé avec cette clé", 404);
    }

    return book;
}

// =============== FONCTIONS USER ===============

/**
 * Récupère un utilisateur par son ID
 */
export async function getUserById(userId: string) {
    const user = await prisma.user.findUnique({
        where: {id: userId}
    });

    if (!user) {
        throw new ValidationError("Utilisateur non trouvé", 404);
    }

    return user;
}

/**
 * Récupère un utilisateur par son username
 */
export async function getUserByUsername(username: string) {
    const user = await prisma.user.findUnique({
        where: {username}
    });

    if (!user) {
        throw new ValidationError("Utilisateur non trouvé", 404);
    }

    return user;
}

/**
 * Récupère un utilisateur sans le mot de passe
 */
export async function getUserByIdWithoutPassword(userId: string): Promise<UserWithoutPassword> {
    const user = await getUserById(userId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password, ...userWithoutPassword} = user;
    return userWithoutPassword;
}

// =============== FONCTIONS USERBOOK ===============

/**
 * Récupère la relation UserBook entre un utilisateur et un livre
 */
export async function getUserBookByUserIdBookId(userId: string, bookId: string) {
    const userBook = await prisma.userBook.findFirst({
        where: {
            userId,
            bookId
        }
    });

    if (!userBook) {
        throw new ValidationError("L'utilisateur ne possède pas encore ce livre", 400);
    }

    return userBook;
}

/**
 * Récupère la relation UserBook avec les relations incluses
 */
export async function getUserBookWithRelations(userId: string, bookId: string): Promise<UserBookWithRelations> {
    const userBook = await prisma.userBook.findFirst({
        where: {
            userId,
            bookId
        },
        include: {
            Book: true,
            User: {
                select: {
                    id: true,
                    name: true,
                    username: true
                }
            }
        }
    });

    if (!userBook) {
        throw new ValidationError("L'utilisateur ne possède pas encore ce livre", 400);
    }

    return userBook;
}

/**
 * Vérifie si un utilisateur possède un livre
 */
export async function checkUserOwnsBook(userId: string, bookId: string): Promise<boolean> {
    const userBook = await prisma.userBook.findFirst({
        where: {userId, bookId}
    });

    return !!userBook;
}

// =============== FONCTIONS NOTES ===============

/**
 * Récupère une note par son ID avec vérification d'appartenance à l'utilisateur
 */
export async function getUserBookNoteById(noteId: string, userId: string, bookId?: string) {
    const whereCondition: Prisma.UserBookNotesWhereInput = {
        id: noteId,
        userId,
        ...(bookId && {bookId})
    };

    const note = await prisma.userBookNotes.findFirst({
        where: whereCondition
    });

    if (!note) {
        throw new ValidationError("Note non trouvée ou non autorisée", 404);
    }

    return note;
}

/**
 * Récupère une note avec ses relations
 */
export async function getUserBookNoteWithRelations(noteId: string, userId: string, bookId?: string): Promise<BookNoteWithRelations> {
    const whereCondition: Prisma.UserBookNotesWhereInput = {
        id: noteId,
        userId,
        ...(bookId && {bookId})
    };

    const note = await prisma.userBookNotes.findFirst({
        where: whereCondition,
        include: {
            User: {
                select: {
                    name: true,
                    username: true,
                }
            },
            Book: {
                select: {
                    title: true,
                }
            },
        }
    });

    if (!note) {
        throw new ValidationError("Note non trouvée ou non autorisée", 404);
    }

    return note;
}

// =============== FONCTIONS FOLLOW ===============

/**
 * Vérifie si un utilisateur suit un autre utilisateur
 */
export async function checkUserFollows(followerId: string, followingId: string): Promise<boolean> {
    const follow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId,
                followingId
            }
        }
    });

    return !!follow;
}

/**
 * Vérifie si deux utilisateurs sont amis (se suivent mutuellement)
 */
export async function checkUsersAreFriends(userId1: string, userId2: string): Promise<boolean> {
    const friendship = await prisma.follow.findFirst({
        where: {
            OR: [
                {followerId: userId1, followingId: userId2},
                {followerId: userId2, followingId: userId1}
            ]
        }
    });

    return !!friendship;
}

/**
 * Récupère la relation de suivi entre deux utilisateurs
 */
export async function getFollowRelation(followerId: string, followingId: string) {
    const follow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId,
                followingId
            }
        }
    });

    if (!follow) {
        throw new ValidationError("Vous ne suivez pas cet utilisateur", 400);
    }

    return follow;
}

// =============== FONCTIONS REVIEW ===============

/**
 * Récupère une review par utilisateur et livre
 */
export async function getBookReviewByUserAndBook(userId: string, bookId: string) {
    return await prisma.bookReview.findUnique({
        where: {
            userId_bookId: {userId, bookId}
        }
    });
}

/**
 * Vérifie si un utilisateur a déjà reviewé un livre
 */
export async function checkUserHasReviewedBook(userId: string, bookId: string): Promise<boolean> {
    const review = await getBookReviewByUserAndBook(userId, bookId);
    return !!review;
}

// =============== FONCTIONS UTILITAIRES ===============

/**
 * Valide qu'un utilisateur ne peut pas effectuer une action sur lui-même
 */
export function validateNotSelfAction(currentUserId: string, targetUserId: string, actionName: string = "cette action") {
    if (currentUserId === targetUserId) {
        throw new ValidationError(`Vous ne pouvez pas ${actionName} sur vous-même`, 400);
    }
}

/**
 * Valide qu'un ID existe et n'est pas vide
 */
export function validateId(id: string | undefined, fieldName: string) {
    if (!id || id.trim().length === 0) {
        throw new ValidationError(`${fieldName} est requis`, 400);
    }
    return id.trim();
}