import {fetcher} from "@/utils/fetcher";
import useSWR from "swr";
import {useDebounce} from "@uidotdev/usehooks";
import {useUser} from "@/hooks/useUser";
import axios from "axios";
import {useMemo, useCallback} from "react";
import {Book, MoreInfoBook} from "@/types";
import {api} from "@/utils/api";
import {SWR_CONFIG} from "@/constants/SWR";

type OpenLibraryResponse = {
    docs: Book[];
};

export function useBooks(bookName?: string | null) {
    const debouncedBookName = useDebounce(bookName, 500);
    const {user, isLoading: isUserLoading, refreshUser} = useUser();

    const shouldFetch = Boolean(debouncedBookName);

    const apiUrl = shouldFetch && debouncedBookName
        ? `https://openlibrary.org/search.json?q=${encodeURIComponent(debouncedBookName)}`
        : null;

    const {data, error, isLoading} = useSWR<OpenLibraryResponse>(
        apiUrl,
        fetcher,
        SWR_CONFIG
    );


    const bookSets = useMemo(() => {
        if (!user) return {
            libraryKeys: new Set(),
            wishlistKeys: new Set(),
            currentBookKeys: new Set(),
            finishedBookKeys: new Set(),
            reviewedKeys: new Set()
        };

        const libraryKeys = new Set();
        const wishlistKeys = new Set();
        const currentBookKeys = new Set();
        const finishedBookKeys = new Set();
        const reviewedKeys = new Set();

        user.UserBook.forEach((ub) => {
            libraryKeys.add(ub.Book.key);
            if (ub.isCurrentBook) currentBookKeys.add(ub.Book.key);
            if (ub.finishedAt) finishedBookKeys.add(ub.Book.key);
        });

        user.UserBookWishlist.forEach((uw) => {
            wishlistKeys.add(uw.Book.key);
        });

        if (user.BookReview) {
            user.BookReview.forEach((review) => {
                reviewedKeys.add(review.Book.key);
            });
        }

        return {libraryKeys, wishlistKeys, currentBookKeys, finishedBookKeys, reviewedKeys};
    }, [user]);


    const isInLibrary = useCallback((bookKey: string) => bookSets.libraryKeys.has(bookKey), [bookSets.libraryKeys]);
    const isInWishlist = useCallback((bookKey: string) => bookSets.wishlistKeys.has(bookKey), [bookSets.wishlistKeys]);
    const isReviewed = useCallback((bookKey: string) => bookSets.reviewedKeys.has(bookKey), [bookSets.reviewedKeys]);
    const isCurrentBook = useCallback((bookKey: string) => bookSets.currentBookKeys.has(bookKey), [bookSets.currentBookKeys]);
    const isBookFinished = useCallback((bookKey: string) => bookSets.finishedBookKeys.has(bookKey), [bookSets.finishedBookKeys]);


    const getBookNumberOfPages = useCallback(async (bookKey: string): Promise<number | null> => {
        try {
            const response = await axios.get(`https://openlibrary.org${bookKey}/editions.json`);
            const editions = response.data.entries;

            for (const edition of editions) {
                if (edition.number_of_pages) {
                    return edition.number_of_pages;
                }
            }
            return null;
        } catch (error) {
            console.error("Erreur lors de la récupération du nombre de pages:", error);
            return null;
        }
    }, []);

    const toggleLibrary = useCallback(async (book: Book | MoreInfoBook) => {
        if (!user?.id) return;
        try {
            if (isInLibrary(book.key)) {
                await api.delete("/user/books", {
                    data: {
                        userId: user.id, book
                    }
                });
            } else {
                if (isInWishlist(book.key)) {
                    await api.delete("/user/wishlist", {data: {userId: user.id, book}});
                }

                let number_of_pages = null;

                if ('number_of_pages' in book && book.number_of_pages) {
                    number_of_pages = book.number_of_pages;
                } else if ('numberOfPages' in book && book.numberOfPages) {
                    number_of_pages = book.numberOfPages;
                } else {
                    number_of_pages = await getBookNumberOfPages(book.key);
                }

                await api.post("/user/books", {
                    userId: user.id,
                    book: {
                        ...book,
                        number_of_pages
                    }
                });
            }
            await refreshUser();
        } catch (error) {
            console.error("Erreur lors de la modification de la bibliothèque:", error);
        }
    }, [user, isInLibrary, isInWishlist, refreshUser, getBookNumberOfPages]);

    const toggleWishlist = useCallback(async (book: Book) => {
        if (!user?.id) return;
        try {
            if (isInWishlist(book.key)) {
                await api.delete("/user/wishlist", {data: {userId: user.id, book}});
            } else {
                if (isInLibrary(book.key)) {
                    await api.delete("/user/books", {data: {userId: user.id, book}});
                }
                await api.post("/user/wishlist", {userId: user.id, book});
            }
            await refreshUser();
        } catch (error) {
            console.error("Erreur lors de la modification de la wishlist:", error);
        }
    }, [user, isInWishlist, isInLibrary, refreshUser]);

    const toggleCurrentBook = useCallback(async (book: Book | MoreInfoBook) => {
        if (!user?.id) return;
        try {
            const currentBook = user?.UserBook.find((ub) => ub.Book.key === book.key);
            if (currentBook && book) {
                await api.put("/user/book/current-book", {
                    userId: user.id,
                    bookId: book.id,
                    isCurrentBook: !currentBook.isCurrentBook
                });
            }
            await refreshUser();
        } catch (error) {
            console.error("Erreur lors de la modification du livre actuel:", error);
        }
    }, [user, refreshUser]);

    const updateBookProgress = useCallback(async (bookKey: string, progress: number) => {
        if (!user?.id) return;
        try {
            const userBook = user?.UserBook.find((ub) => ub.Book.key === bookKey);
            if (userBook) {
                const response = await api.put("/user/book/progress", {
                    userId: user.id,
                    bookId: userBook.Book.id,
                    progress
                });
                await refreshUser();
                return response;
            } else {
                console.log("No user book found");
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la progression:", error);
        }
    }, [user, refreshUser]);

    const updateBookPageCount = useCallback(async (bookId: string, pageCount: number) => {
        if (!user?.id) return;
        try {
            await api.put("/book/page-count", {
                bookId,
                pageCount
            });
            await refreshUser();
        } catch (error) {
            console.error("Erreur lors de la mise à jour du nombre de pages:", error);
        }
    }, [user, refreshUser]);

    const updateBookProgressType = useCallback(async (bookKey: string, progressType: 'page' | 'percentage') => {
        if (!user?.id) return;
        try {
            const userBook = user?.UserBook.find((ub) => ub.Book.key === bookKey);
            if (userBook) {
                await api.put("/user/book/progress-type", {
                    userId: user.id,
                    bookId: userBook.Book.id,
                    progressType
                });
                await refreshUser();
            } else {
                console.log("No user book found");
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du type de progression:", error);
        }
    }, [user, refreshUser]);

    const books = useMemo(() => data?.docs || [], [data]);

    return {
        books,
        isLoading,
        isError: Boolean(error),
        isUserLoading,
        isBookFinished,
        isInLibrary,
        isInWishlist,
        isCurrentBook,
        isReviewed,
        toggleLibrary,
        toggleWishlist,
        toggleCurrentBook,
        updateBookProgress,
        updateBookPageCount,
        updateBookProgressType,
    };
}
