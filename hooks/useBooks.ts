import {fetcher} from "@/utils/fetcher";
import useSWR, {mutate} from "swr";
import {useDebounce} from "@uidotdev/usehooks";
import {useUser} from "@/hooks/useUser";
import axios from "axios";

export type Book = {
    key: string;
    title: string;
    cover_i?: number;
    cover?: string;
    author_name?: string[];
    first_publish_year?: number;
    language?: string[];
    authors?: string[];
};

type OpenLibraryResponse = {
    docs: Book[];
};

export function useBooks(bookName?: string | null, userId?: string) {
    const debouncedBookName = useDebounce(bookName, 500);
    const {user, isLoading: isUserLoading} = useUser(userId);

    const shouldFetch = !!debouncedBookName;

    const {data, error, isLoading} = useSWR<OpenLibraryResponse>(
        shouldFetch ? `https://openlibrary.org/search.json?q=${debouncedBookName}` : null,
        fetcher
    );

    const isInLibrary = (bookKey: string) => user?.UserBook.some((ub) => ub.Book.key === bookKey);
    const isInWishlist = (bookKey: string) => user?.UserBookWishlist.some((uw) => uw.Book.key === bookKey);
    const isCurrentBook = (bookKey: string) => user?.UserBook.some((ub) => ub.Book.key === bookKey && ub.isCurrentBook);

    const toggleLibrary = async (book: Book) => {
        if (!userId) return;
        try {
            if (isInLibrary(book.key)) {
                await axios.delete(`/api/user/books`, {data: {userId, book: book}});
            } else {
                await axios.post("/api/user/books", {userId, book: book});
            }
            await mutate(`/api/user/${userId}`);
        } catch (error) {
            console.error("Erreur lors de la modification de la bibliothèque:", error);
        }
    };

    const toggleWishlist = async (book: Book) => {
        if (!userId) return;
        try {
            if (isInWishlist(book.key)) {
                await axios.delete(`/api/user/wishlist`, {data: {userId, book: book}});
            } else {
                await axios.post("/api/user/wishlist", {userId, book: book});
            }
            await mutate(`/api/user/${userId}`);
        } catch (error) {
            console.error("Erreur lors de la modification de la wishlist:", error);
        }
    };

    const toggleCurrentBook = async (book: Book) => {
        if (!userId) return;
        try {
            const currentBook = user?.UserBook.find((ub) => ub.Book.key === book.key);
            if (currentBook) {
                await axios.put(`/api/user/current-book`, {
                    data: {
                        userId,
                        book: book,
                        isCurrentBook: !currentBook.isCurrentBook
                    }
                });
            } else {
                await axios.post("/api/user/current-book", {userId, book: book});
            }
            await mutate(`/api/user/${userId}`);
        } catch (error) {
            console.error("Erreur lors de la modification du livre actuel:", error);
        }
    };

    return {
        books: data?.docs || [],
        isLoading,
        isError: !!error,
        isUserLoading,
        isInLibrary,
        isInWishlist,
        isCurrentBook,
        toggleLibrary,
        toggleWishlist,
        toggleCurrentBook,
    };
}
