import { fetcher } from "@/utils/fetcher";
import useSWR, { mutate } from "swr";
import { useDebounce } from "@uidotdev/usehooks";
import { useUser } from "@/hooks/useUser";

export type Book = {
    key: string;
    title: string;
    cover_i?: number;
    author_name?: string[];
    first_publish_year?: number;
    language?: string[];
};

type OpenLibraryResponse = {
    docs: Book[];
};

export function useBooks(bookName: string | null, userId?: string) {
    const debouncedBookName = useDebounce(bookName, 500);
    const { user, isLoading: isUserLoading } = useUser(userId);

    const { data, error, isLoading } = useSWR<OpenLibraryResponse>(
        debouncedBookName
            ? `https://openlibrary.org/search.json?q=${debouncedBookName}&limit=10`
            : null,
        fetcher
    );

    const isInLibrary = (bookId: string) => user?.UserBook.some((ub) => ub.bookId === bookId);
    const isInWishlist = (bookId: string) => user?.UserBookWishlist.some((uw) => uw.bookId === bookId);

    const addToLibrary = async (book: Book) => {
        if (!userId) return;
        try {
            await fetch("/api/user-books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, book }),
            });
            await mutate(`/api/user/${userId}`);
        } catch (error) {
            console.error("Erreur lors de l'ajout à la bibliothèque:", error);
        }
    };

    const addToWishlist = async (book: Book) => {
        if (!userId) return;
        try {
            await fetch("/api/user-wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, book }),
            });
            await mutate(`/api/user/${userId}`);
        } catch (error) {
            console.error("Erreur lors de l'ajout à la wishlist:", error);
        }
    };

    return {
        books: data?.docs || [],
        isLoading,
        isError: !!error,
        isUserLoading,
        isInLibrary,
        isInWishlist,
        addToLibrary,
        addToWishlist,
    };
}
