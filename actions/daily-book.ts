"use server"

import axios from "axios";
import {fetchMoreBookInfos} from "./book";
import prisma from "@/utils/prisma";

interface OpenLibrarySearchResult {
    docs: Array<{
        key: string;
        title: string;
        author_name?: string[];
        cover_i?: number;
        first_publish_year?: number;
        subject?: string[];
    }>;
    numFound: number;
}

interface DailyBookData {
    key: string;
    title: string;
    authors: string[];
    cover?: string;
    numberOfPages?: number;
    subjects?: string[];
    publishYear?: number;
}

/**
 * Récupère des livres populaires depuis Open Library avec plus de variété
 * @param limit Nombre de livres à récupérer
 * @param offset Décalage pour la pagination
 * @param subject Sujet spécifique (optionnel)
 */
export async function fetchPopularBooks(
    limit: number = 100,
    offset: number = 0,
    subject?: string
): Promise<string[]> {
    try {
        const subjects = [
            'fiction', 'science', 'history', 'biography', 'mystery', 'romance', 'fantasy',
            'adventure', 'drama', 'poetry', 'philosophy', 'psychology', 'art', 'music',
            'travel', 'cooking', 'health', 'business', 'technology', 'nature'
        ];

        const selectedSubject = subject || subjects[Math.floor(Math.random() * subjects.length)];

        // Varier les critères de tri pour plus de diversité
        const sortOptions = ['rating', 'new', 'old', 'random'];
        const randomSort = sortOptions[Math.floor(Math.random() * sortOptions.length)];

        const response = await axios.get<OpenLibrarySearchResult>(
            `https://openlibrary.org/search.json?subject=${selectedSubject}&limit=${limit}&offset=${offset}&sort=${randomSort}`
        );

        // Filtrer les livres avec des données valides
        const validBooks = response.data.docs.filter(book =>
            book.key &&
            book.title &&
            book.key.startsWith('/works/') // S'assurer que c'est bien une clé de work
        );

        return validBooks.map(book => book.key);
    } catch (error) {
        console.error('Erreur lors de la récupération des livres populaires:', error);

        // Fallback: recherche générale
        try {
            const response = await axios.get<OpenLibrarySearchResult>(
                `https://openlibrary.org/search.json?q=*&limit=${limit}&offset=${offset}`
            );

            const validBooks = response.data.docs.filter(book =>
                book.key && book.title && book.key.startsWith('/works/')
            );

            return validBooks.map(book => book.key);
        } catch (fallbackError) {
            console.error('Erreur lors du fallback:', fallbackError);
            return [];
        }
    }
}

/**
 * Sélectionne un livre du jour personnalisé pour chaque utilisateur
 * Chaque utilisateur aura un livre différent qu'il n'a jamais vu
 * @param userId ID de l'utilisateur (obligatoire pour la personnalisation)
 */
export async function selectDailyBookForUser(userId: string): Promise<string | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Vérifier si l'utilisateur a déjà un livre du jour pour aujourd'hui
    const existingUserView = await prisma.dailyBookView.findFirst({
        where: {
            userId,
            date: today
        }
    });

    if (existingUserView) {
        return existingUserView.bookKey;
    }

    // Récupérer TOUS les livres que cet utilisateur a déjà vus
    const userViewedBooks = await prisma.dailyBookView.findMany({
        where: {userId},
        select: {bookKey: true}
    });

    const viewedKeys = new Set(userViewedBooks.map(view => view.bookKey));

    // Essayer de trouver un livre que l'utilisateur n'a jamais vu
    let attempts = 0;
    const maxAttempts = 20; // Plus d'essais pour être sûr

    while (attempts < maxAttempts) {
        const offset = Math.floor(Math.random() * 2000); // Offset plus large
        const availableBooks = await fetchPopularBooks(100, offset);

        // Filtrer les livres déjà vus par cet utilisateur
        const newBooksForUser = availableBooks.filter(key => !viewedKeys.has(key));

        if (newBooksForUser.length > 0) {
            const selectedKey = newBooksForUser[Math.floor(Math.random() * newBooksForUser.length)];

            // Marquer immédiatement le livre comme vu pour cet utilisateur
            await prisma.dailyBookView.create({
                data: {
                    userId,
                    bookKey: selectedKey,
                    date: today
                }
            });

            return selectedKey;
        }

        attempts++;
    }

    // Si vraiment aucun livre trouvé, essayer avec différents sujets
    const subjects = ['fiction', 'science', 'history', 'biography', 'mystery', 'romance', 'fantasy', 'adventure', 'drama', 'poetry'];

    for (const subject of subjects) {
        try {
            const response = await axios.get<OpenLibrarySearchResult>(
                `https://openlibrary.org/search.json?subject=${subject}&limit=100&sort=random`
            );

            const subjectBooks = response.data.docs.map(book => book.key);
            const newBooksForUser = subjectBooks.filter(key => !viewedKeys.has(key));

            if (newBooksForUser.length > 0) {
                const selectedKey = newBooksForUser[Math.floor(Math.random() * newBooksForUser.length)];

                await prisma.dailyBookView.create({
                    data: {
                        userId,
                        bookKey: selectedKey,
                        date: today
                    }
                });

                return selectedKey;
            }
        } catch (error) {
            console.error(`Erreur avec le sujet ${subject}:`, error);
        }
    }

    console.warn(`Aucun nouveau livre trouvé pour l'utilisateur ${userId}. Il a peut-être vu énormément de livres !`);
    return null;
}

/**
 * Version globale — même livre pour tous les utilisateurs ce jour-là
 * Mais chaque utilisateur ne le verra qu'une seule fois
 * @param userId ID de l'utilisateur pour vérifier s'il l'a déjà vu
 */
export async function selectGlobalDailyBook(userId?: string): Promise<string | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Vérifier s'il y a déjà un livre du jour global pour aujourd'hui
    const existingDailyBook = await prisma.dailyBook.findUnique({
        where: {date: today}
    });

    if (existingDailyBook && existingDailyBook.isActive) {
        // Si l'utilisateur a déjà vu ce livre, ne pas le proposer
        if (userId) {
            const userAlreadyViewed = await prisma.dailyBookView.findFirst({
                where: {
                    userId,
                    bookKey: existingDailyBook.bookKey
                }
            });

            if (userAlreadyViewed) {
                // L'utilisateur a déjà vu ce livre, lui proposer un livre personnalisé
                return await selectDailyBookForUser(userId);
            }
        }

        return existingDailyBook.bookKey;
    }

    // Récupérer tous les livres déjà proposés globalement
    const usedBookKeys = await prisma.dailyBook.findMany({
        select: {bookKey: true},
        where: {isActive: true}
    });

    const usedKeys = new Set(usedBookKeys.map(book => book.bookKey));

    // Essayer de trouver un livre jamais proposé globalement
    let attempts = 0;
    const maxAttempts = 15;

    while (attempts < maxAttempts) {
        const offset = Math.floor(Math.random() * 1000);
        const availableBooks = await fetchPopularBooks(100, offset);

        const newBooks = availableBooks.filter(key => !usedKeys.has(key));

        if (newBooks.length > 0) {
            const selectedKey = newBooks[Math.floor(Math.random() * newBooks.length)];

            // Sauvegarder le livre du jour global
            await prisma.dailyBook.upsert({
                where: {date: today},
                update: {bookKey: selectedKey, isActive: true},
                create: {bookKey: selectedKey, date: today}
            });

            return selectedKey;
        }

        attempts++;
    }

    // Si vraiment aucun livre trouvé, fallback vers un livre personnalisé
    if (userId) {
        return await selectDailyBookForUser(userId);
    }

    return null;
}

/**
 * Récupère le livre du jour avec ses détails complets
 * GARANTIT que l'utilisateur ne verra jamais le même livre deux fois
 * @param userId ID de l'utilisateur (obligatoire pour éviter les répétitions)
 * @param useGlobalSystem Si true, utilise le système global, sinon complètement personnalisé
 */
export async function getDailyBookWithDetails(
    userId: string,
    useGlobalSystem: boolean = false
): Promise<DailyBookData | null> {

    const bookKey: string | null = useGlobalSystem
        ? await selectGlobalDailyBook(userId)
        : await selectDailyBookForUser(userId);

    if (!bookKey) {
        console.warn(`Aucun livre trouvé pour l'utilisateur ${userId}`);
        return null;
    }

    try {
        const bookDetails = await fetchMoreBookInfos(bookKey);

        if (bookDetails.error) {
            console.error('Erreur lors de la récupération des détails:', bookDetails.error);
            return null;
        }

        // Le livre est déjà marqué comme vu dans selectDailyBookForUser
        if (useGlobalSystem) {
            await markBookAsViewed(userId, bookKey);
        }

        return {
            key: bookKey,
            title: bookDetails.title || 'Titre inconnu',
            authors: bookDetails.authors || [],
            cover: bookDetails.cover,
            numberOfPages: bookDetails.numberOfPages,
            subjects: bookDetails.subjects,
            publishYear: bookDetails.first_publish_year
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du livre:', error);
        return null;
    }
}

/**
 * Marque un livre comme vu par un utilisateur
 * @param userId ID de l'utilisateur
 * @param bookKey Key Open Library du livre
 */
export async function markBookAsViewed(userId: string, bookKey: string): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        await prisma.dailyBookView.upsert({
            where: {
                userId_bookKey_date: {
                    userId,
                    bookKey,
                    date: today
                }
            },
            update: {viewedAt: new Date()},
            create: {
                userId,
                bookKey,
                date: today
            }
        });
    } catch (error) {
        console.error('Erreur lors du marquage du livre comme vu:', error);
    }
}

/**
 * Récupère l'historique des livres du jour
 * @param limit Nombre de livres à récupérer
 */
export async function getDailyBookHistory(limit: number = 30): Promise<Array<{
    bookKey: string;
    date: Date;
    viewCount: number;
}>> {
    try {
        const history = await prisma.dailyBook.findMany({
            take: limit,
            orderBy: {date: 'desc'},
            where: {isActive: true}
        });

        // Compter les vues pour chaque livre
        return await Promise.all(
            history.map(async (book) => {
                const viewCount = await prisma.dailyBookView.count({
                    where: {bookKey: book.bookKey}
                });

                return {
                    bookKey: book.bookKey,
                    date: book.date,
                    viewCount
                };
            })
        );
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        return [];
    }
}

/**
 * Récupère les statistiques des livres du jour
 * @param userId ID de l'utilisateur (optionnel)
 */
export async function getDailyBookStats(userId?: string) {
    try {
        const totalDailyBooks = await prisma.dailyBook.count({
            where: {isActive: true}
        });

        const totalViews = await prisma.dailyBookView.count();

        let userViews = 0;
        if (userId) {
            userViews = await prisma.dailyBookView.count({
                where: {userId}
            });
        }

        return {
            totalDailyBooks,
            totalViews,
            userViews,
            averageViewsPerBook: totalDailyBooks > 0 ? Math.round(totalViews / totalDailyBooks) : 0
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        return {
            totalDailyBooks: 0,
            totalViews: 0,
            userViews: 0,
            averageViewsPerBook: 0
        };
    }
}

/**
 * Vérifie si un utilisateur peut encore découvrir de nouveaux livres
 * @param userId ID de l'utilisateur
 */
export async function canUserDiscoverNewBooks(userId: string): Promise<{
    canDiscover: boolean;
    viewedCount: number;
    estimatedRemaining: number;
}> {
    const viewedCount = await prisma.dailyBookView.count({
        where: {userId}
    });

    // Estimation très approximative du nombre de livres disponibles sur Open Library
    const estimatedTotalBooks = 50000; // Nombre conservateur
    const estimatedRemaining = Math.max(0, estimatedTotalBooks - viewedCount);

    return {
        canDiscover: estimatedRemaining > 0,
        viewedCount,
        estimatedRemaining
    };
}

/**
 * Récupère les statistiques détaillées d'un utilisateur
 * @param userId ID de l'utilisateur
 */
export async function getUserBookDiscoveryStats(userId: string) {
    const totalViewed = await prisma.dailyBookView.count({
        where: {userId}
    });

    const uniqueDates = await prisma.dailyBookView.findMany({
        where: {userId},
        select: {date: true},
        distinct: ['date'],
        orderBy: {date: 'desc'}
    });

    const activeDays = uniqueDates.length;
    const lastActivity = uniqueDates[0]?.date;

    // Calculer la streak actuelle
    let currentStreak = 0;
    if (lastActivity) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const checkDate = new Date(today);

        for (let i = 0; i < uniqueDates.length; i++) {
            const activityDate = new Date(uniqueDates[i].date);
            activityDate.setHours(0, 0, 0, 0);

            if (activityDate.getTime() === checkDate.getTime()) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
    }

    return {
        totalBooksViewed: totalViewed,
        activeDays,
        currentStreak,
        lastActivity,
        averageBooksPerDay: activeDays > 0 ? Math.round(totalViewed / activeDays * 100) / 100 : 0
    };
}