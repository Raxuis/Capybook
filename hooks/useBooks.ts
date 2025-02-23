import { fetcher } from "@/utils/fetcher";
import useSWR, { mutate } from "swr";
import { useDebounce } from "@uidotdev/usehooks";
import { useUser } from "@/hooks/useUser";
import axios from "axios";

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

  const isInLibrary = (bookKey: string) => user?.UserBook.some((ub) => ub.Book.key === bookKey);
  const isInWishlist = (bookKey: string) => user?.UserBookWishlist.some((uw) => uw.Book.key === bookKey);

  const addToLibrary = async (book: Book) => {
    if (!userId) return;
    try {
      await axios.post(
        "/api/user/books",
        { userId, bookKey: book.key },
        { headers: { "Content-Type": "application/json" } }
      );
      await mutate(`/api/user/${userId}`);
    } catch (error) {
      console.error("Erreur lors de l'ajout à la bibliothèque:", error);
    }
  };

  const addToWishlist = async (book: Book) => {
    if (!userId) return;
    try {
      await axios.post(
        "/api/user/wishlist",
        { userId, bookKey: book.key },
        { headers: { "Content-Type": "application/json" } }
      );
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
