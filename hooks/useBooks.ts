import {fetcher} from "@/utils/fetcher";
import useSWR, {mutate} from "swr";
import {useDebounce} from "@uidotdev/usehooks";
import {useUser} from "@/hooks/useUser";
import axios from "axios";
import {useMemo, useCallback} from "react";
import {Book} from "@/types";

type OpenLibraryResponse = {
    docs: Book[];
};

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export function useBooks(bookName?: string | null, userId?: string) {
    const debouncedBookName = useDebounce(bookName, 500);
    const {user, isLoading: isUserLoading} = useUser(userId);

    const shouldFetch = Boolean(debouncedBookName);

    const apiUrl = shouldFetch && debouncedBookName
        ? `https://openlibrary.org/search.json?jscmd=data?q=${encodeURIComponent(debouncedBookName)}`
        : null;

    const {data, error, isLoading} = useSWR<OpenLibraryResponse>(
        apiUrl,
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000, // 1 minute
        }
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

    const mutateUser = useCallback(async () => {
        if (userId) await mutate(`/api/user/${userId}`);
    }, [userId]);

    const toggleLibrary = useCallback(async (book: Book) => {
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

    const toggleWishlist = useCallback(async (book: Book) => {
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

    const toggleCurrentBook = useCallback(async (book: Book) => {
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
    };
}