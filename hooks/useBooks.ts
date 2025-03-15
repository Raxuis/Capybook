import {fetcher} from "@/utils/fetcher";
import useSWR, {mutate} from "swr";
import {useDebounce} from "@uidotdev/usehooks";
import {useUser} from "@/hooks/useUser";
import axios from "axios";
import {useMemo, useCallback} from "react";
import {Book, OpenLibraryISBNBook} from "@/types";


export type OpenLibraryResponse = {
    docs: Book[];
    numFound?: number;
    start?: number;
    numFoundExact?: boolean;
};

export type OpenLibraryISBNResponse = {
    [key: string]: OpenLibraryISBNBook;
};


export interface ApiInstance {
    post: <TData = unknown, TResponse = unknown>(url: string, data?: TData) => Promise<TResponse>;
    delete: <TResponse = unknown>(url: string, config?: { data?: unknown }) => Promise<TResponse>;
    put: <TData = unknown, TResponse = unknown>(url: string, data?: TData) => Promise<TResponse>;
}

export interface BookSets {
    libraryKeys: Set<string>;
    wishlistKeys: Set<string>;
    currentBookKeys: Set<string>;
    finishedBookKeys: Set<string>;
    reviewedKeys: Set<string>;
}

export interface UseBooksResult {
    books: Book[];
    isLoading: boolean;
    isError: boolean;
    isUserLoading: boolean;
    isBookFinished: (bookKey: string) => boolean;
    isInLibrary: (bookKey: string) => boolean;
    isInWishlist: (bookKey: string) => boolean;
    isCurrentBook: (bookKey: string) => boolean;
    isReviewed: (bookKey: string) => boolean;
    toggleLibrary: (book: Book) => Promise<void>;
    toggleWishlist: (book: Book) => Promise<void>;
    toggleCurrentBook: (book: Book) => Promise<void>;
}

const api: ApiInstance = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export function useBooks(
    bookName?: string | null,
    userId?: string,
    searchType: string = 'general'
): UseBooksResult {
    const debouncedBookName = useDebounce<string | null | undefined>(bookName, 500);
    const {user, isLoading: isUserLoading} = useUser(userId);

    const shouldFetch = Boolean(debouncedBookName);

    const getApiUrl = (): string | null => {
        if (!shouldFetch || !debouncedBookName) return null;

        if (searchType === 'isbn') {
            const cleanIsbn = debouncedBookName.replace(/-/g, '');
            return `https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&format=json&jscmd=data`;
        } else {
            return `https://openlibrary.org/search.json?q=${encodeURIComponent(debouncedBookName)}`;
        }
    };

    const apiUrl = getApiUrl();

    const {data, error, isLoading} = useSWR<OpenLibraryResponse | OpenLibraryISBNResponse>(
        apiUrl,
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000, // 1 minute
        }
    );

    const bookSets = useMemo<BookSets>(() => {
        if (!user) return {
            libraryKeys: new Set<string>(),
            wishlistKeys: new Set<string>(),
            currentBookKeys: new Set<string>(),
            finishedBookKeys: new Set<string>(),
            reviewedKeys: new Set<string>()
        };

        const libraryKeys = new Set<string>();
        const wishlistKeys = new Set<string>();
        const currentBookKeys = new Set<string>();
        const finishedBookKeys = new Set<string>();
        const reviewedKeys = new Set<string>();

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

    const isInLibrary = useCallback((bookKey: string): boolean => bookSets.libraryKeys.has(bookKey), [bookSets.libraryKeys]);
    const isInWishlist = useCallback((bookKey: string): boolean => bookSets.wishlistKeys.has(bookKey), [bookSets.wishlistKeys]);
    const isReviewed = useCallback((bookKey: string): boolean => bookSets.reviewedKeys.has(bookKey), [bookSets.reviewedKeys]);
    const isCurrentBook = useCallback((bookKey: string): boolean => bookSets.currentBookKeys.has(bookKey), [bookSets.currentBookKeys]);
    const isBookFinished = useCallback((bookKey: string): boolean => bookSets.finishedBookKeys.has(bookKey), [bookSets.finishedBookKeys]);

    const mutateUser = useCallback(async (): Promise<void> => {
        if (userId) await mutate(`/api/user/${userId}`);
    }, [userId]);

    const toggleLibrary = useCallback(async (book: Book): Promise<void> => {
        if (!userId) return;
        try {
            if (isInLibrary(book.key)) {
                await api.delete("/user/books", {data: {userId, book}});
            } else {
                if (isInWishlist(book.key)) {
                    await api.delete("/user/wishlist", {data: {userId, book}});
                }
                await api.post("/user/books", {userId, book});
            }
            await mutateUser();
        } catch (error) {
            console.error("Erreur lors de la modification de la bibliothèque:", error);
        }
    }, [userId, isInLibrary, isInWishlist, mutateUser]);

    const toggleWishlist = useCallback(async (book: Book): Promise<void> => {
        if (!userId) return;
        try {
            if (isInWishlist(book.key)) {
                await api.delete("/user/wishlist", {data: {userId, book}});
            } else {
                if (isInLibrary(book.key)) {
                    await api.delete("/user/books", {data: {userId, book}});
                }
                await api.post("/user/wishlist", {userId, book});
            }
            await mutateUser();
        } catch (error) {
            console.error("Erreur lors de la modification de la wishlist:", error);
        }
    }, [userId, isInWishlist, isInLibrary, mutateUser]);

    const toggleCurrentBook = useCallback(async (book: Book): Promise<void> => {
        if (!userId) return;
        try {
            const currentBook = user?.UserBook.find((ub) => ub.Book.key === book.key);
            if (currentBook && book) {
                await api.put("/user/book/current-book", {
                    userId,
                    bookId: book.id,
                    isCurrentBook: !currentBook.isCurrentBook
                });
            }
            await mutateUser();
        } catch (error) {
            console.error("Erreur lors de la modification du livre actuel:", error);
        }
    }, [userId, user, mutateUser]);

    const books = useMemo<Book[]>(() => {
        if (!data) return [];

        if (searchType === 'general') {
            return ((data as OpenLibraryResponse).docs || []);
        }

        const isbnData = data as OpenLibraryISBNResponse;
        const results: Book[] = [];

        for (const key in isbnData) {
            if (isbnData.hasOwnProperty(key)) {
                const book = isbnData[key];
                const isbn = key.replace('ISBN:', '');

                results.push({
                    id: isbn,
                    key: `OLID:${isbn}`,
                    title: book.title,
                    author_name: book.authors?.map((a) => a.name) || ["Auteur inconnu"],
                    first_publish_year: book.publish_date ? new Date(book.publish_date).getFullYear() : undefined,
                    cover_i: book.cover?.medium ?
                        parseInt(book.cover.medium.replace('https://covers.openlibrary.org/b/id/', '').replace('-M.jpg', '')) :
                        undefined,
                    cover: book.cover?.medium || undefined,
                    language: book.languages?.map((l) => l.key.replace('/languages/', '')) || undefined,
                    isbn: [isbn],
                });
            }
        }

        return results;
    }, [data, searchType]);

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
    };
}