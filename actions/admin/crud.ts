"use server";

import prisma from "@/utils/prisma";
import {Badge, Book, BookReview, Genre, ReadingGoal, User} from "@prisma/client";

// Types pour les entrées de données qui correspondent aux modèles Prisma
type UserCreateInput = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'emailVerified'> & {
    emailVerified?: Date | null;
};

type UserUpdateInput = Partial<UserCreateInput>;

type BookCreateInput = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;
type BookUpdateInput = Partial<BookCreateInput>;

type GenreCreateInput = Omit<Genre, 'id' | 'createdAt' | 'updatedAt'>;
type GenreUpdateInput = Partial<GenreCreateInput>;

type ReviewCreateInput = Omit<BookReview, 'id' | 'createdAt' | 'updatedAt'>;
type ReviewUpdateInput = Partial<ReviewCreateInput>;

type BadgeCreateInput = Omit<Badge, 'id' | 'createdAt' | 'updatedAt'>;
type BadgeUpdateInput = Partial<BadgeCreateInput>;

type ReadingGoalCreateInput = Omit<ReadingGoal, 'id' | 'createdAt' | 'updatedAt'>;
type ReadingGoalUpdateInput = Partial<ReadingGoalCreateInput>;

// User Functions
export async function getUsers() {
    return prisma.user.findMany({
        select: {
            id: true,
            email: true,
            username: true,
            image: true,
            role: true,
            UserBook: {
                include: {
                    Book: true
                }
            },
            UserBookWishlist: {
                include: {
                    Book: true
                }
            },
            BookReview: {
                include: {
                    Book: true
                }
            }
        }
    });
}

export async function getUniqueUser(id: string) {
    return prisma.user.findUnique({
        where: {id},
        select: {
            id: true,
            email: true,
            username: true,
            name: true,
            image: true,
            UserBook: {
                include: {
                    Book: true
                }
            },
            UserBookWishlist: {
                include: {
                    Book: true
                }
            },
            BookReview: {
                include: {
                    Book: true
                }
            }
        }
    });
}

export async function deleteUser(id: string) {
    console.log(`Deleting user with ID: ${id}`);
    return prisma.user.delete({
        where: {id}
    });
}

export async function updateUser(id: string, data: UserUpdateInput) {
    return prisma.user.update({
        where: {id},
        data
    });
}

export async function createUser(data: UserCreateInput) {
    return prisma.user.create({
        data
    });
}

// Book Functions
export async function getBooks() {
    return prisma.book.findMany({
        select: {
            id: true,
            key: true,
            title: true,
            authors: true,
            cover: true,
            numberOfPages: true,
            BookReview: {
                include: {
                    User: true
                }
            },
            BookGenre: {
                include: {
                    genre: true
                }
            }
        }
    });
}

export async function getUniqueBook(id: string) {
    return prisma.book.findUnique({
        where: {id},
        select: {
            id: true,
            key: true,
            title: true,
            authors: true,
            cover: true,
            numberOfPages: true,
            BookReview: {
                include: {
                    User: true
                }
            },
            BookGenre: {
                include: {
                    genre: true
                }
            }
        }
    });
}

export async function deleteBook(id: string) {
    return prisma.book.delete({
        where: {id}
    });
}

export async function updateBook(id: string, data: BookUpdateInput) {
    return prisma.book.update({
        where: {id},
        data
    });
}

export async function createBook(data: BookCreateInput) {
    return prisma.book.create({
        data
    });
}

// Genre Functions
export async function getGenres() {
    return prisma.genre.findMany({
        select: {
            id: true,
            name: true,
            books: {
                include: {
                    book: true
                }
            }
        }
    });
}

export async function getUniqueGenre(id: string) {
    return prisma.genre.findUnique({
        where: {id},
        select: {
            id: true,
            name: true,
            books: {
                include: {
                    book: true
                }
            }
        }
    });
}

export async function deleteGenre(id: string) {
    return prisma.genre.delete({
        where: {id}
    });
}

export async function updateGenre(id: string, data: GenreUpdateInput) {
    return prisma.genre.update({
        where: {id},
        data
    });
}

export async function createGenre(data: GenreCreateInput) {
    return prisma.genre.create({
        data
    });
}

// Review Functions
export async function getReviews() {
    return prisma.bookReview.findMany({
        select: {
            id: true,
            rating: true,
            feedback: true,
            Book: {
                include: {
                    BookGenre: {
                        include: {
                            genre: true
                        }
                    }
                }
            },
            User: true
        }
    });
}

export async function getUniqueReview(id: string) {
    return prisma.bookReview.findUnique({
        where: {id},
        select: {
            id: true,
            rating: true,
            feedback: true,
            Book: {
                include: {
                    BookGenre: {
                        include: {
                            genre: true
                        }
                    }
                }
            },
            User: true
        }
    });
}

export async function deleteReview(id: string) {
    return prisma.bookReview.delete({
        where: {id}
    });
}

export async function updateReview(id: string, data: ReviewUpdateInput) {
    return prisma.bookReview.update({
        where: {id},
        data
    });
}

export async function createReview(data: ReviewCreateInput) {
    return prisma.bookReview.create({
        data
    });
}

// Badge Functions
export async function getBadges() {
    return prisma.badge.findMany({
        select: {
            id: true,
            name: true,
            ownerDescription: true,
            publicDescription: true,
            category: true,
            requirement: true,
            icon: true,
            UserBadge: {
                include: {
                    User: true
                }
            }
        }
    });
}

export async function getUniqueBadge(id: string) {
    return prisma.badge.findUnique({
        where: {id},
        select: {
            id: true,
            name: true,
            ownerDescription: true,
            publicDescription: true,
            category: true,
            requirement: true,
            icon: true,
            UserBadge: {
                include: {
                    User: true
                }
            }
        }
    });
}

export async function deleteBadge(id: string) {
    return prisma.badge.delete({
        where: {id}
    });
}

export async function updateBadge(id: string, data: BadgeUpdateInput) {
    return prisma.badge.update({
        where: {id},
        data
    });
}

export async function createBadge(data: BadgeCreateInput) {
    return prisma.badge.create({
        data
    });
}

// User-related Functions
export async function getUserBadges(id: string) {
    return prisma.userBadge.findMany({
        where: {
            userId: id
        },
        select: {
            id: true,
            userId: true,
            badgeId: true,
            earnedAt: true,
            User: true,
            Badge: true
        }
    });
}

export async function getUserReviews(id: string) {
    return prisma.bookReview.findMany({
        where: {
            userId: id
        },
        select: {
            id: true,
            rating: true,
            feedback: true,
            Book: {
                include: {
                    BookGenre: {
                        include: {
                            genre: true
                        }
                    }
                }
            },
            User: true
        }
    });
}

export async function getUserBooks(id: string) {
    return prisma.userBook.findMany({
        where: {
            userId: id
        },
        select: {
            id: true,
            userId: true,
            bookId: true,
            isCurrentBook: true,
            progressType: true,
            progress: true,
            finishedAt: true,
            Book: true,
            User: true
        }
    });
}

export async function getUserReadingGoals(id: string) {
    return prisma.readingGoal.findMany({
        where: {
            userId: id
        },
        select: {
            id: true,
            userId: true,
            target: true,
            type: true,
            deadline: true,
            progress: true,
            completedAt: true,
            User: true
        }
    });
}

// Nouvelle fonction pour récupérer les données de progression de lecture
export async function getUserReadingProgress(id: string) {
    return prisma.readingProgress.findMany({
        where: {
            userId: id
        },
        select: {
            id: true,
            userId: true,
            readingDayId: true,
            date: true,
            pagesRead: true,
            booksCompleted: true,
            user: true,
            readingDay: true
        }
    });
}

// Nouvelle fonction pour récupérer les jours de lecture
export async function getUserReadingDays(id: string) {
    return prisma.readingDay.findMany({
        where: {
            userId: id
        },
        select: {
            id: true,
            userId: true,
            date: true,
            minutesRead: true,
            pagesRead: true,
            user: true,
            readingProgress: true
        }
    });
}

export async function createReadingGoal(data: ReadingGoalCreateInput) {
    return prisma.readingGoal.create({data});
}

export async function updateReadingGoal(id: string, data: ReadingGoalUpdateInput) {
    return prisma.readingGoal.update({where: {id}, data});
}

export async function deleteReadingGoal(id: string) {
    return prisma.readingGoal.delete({where: {id}});
}

export async function getAllReadingGoals() {
    return prisma.readingGoal.findMany({
        include: {User: true}
    });
}

export async function getUserDependencies(id: string) {
    const [booksCount, reviewsCount, goalsCount, badgesCount] = await Promise.all([
        prisma.userBook.count({where: {userId: id}}),
        prisma.bookReview.count({where: {userId: id}}),
        prisma.readingGoal.count({where: {userId: id}}),
        prisma.userBadge.count({where: {userId: id}})
    ]);

    return {
        booksCount,
        reviewsCount,
        goalsCount,
        badgesCount,
        hasData: booksCount > 0 || reviewsCount > 0 || goalsCount > 0 || badgesCount > 0
    };
}