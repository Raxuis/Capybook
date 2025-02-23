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

  const toggleLibrary = async (book: Book) => {
    if (!userId) return;
    try {
      if (isInLibrary(book.key)) {
        await axios.delete(`/api/user/books`, { data: { userId, bookKey: book.key } });
      } else {
        await axios.post("/api/user/books", { userId, bookKey: book.key });
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
        await axios.delete(`/api/user/wishlist`, { data: { userId, bookKey: book.key } });
      } else {
        await axios.post("/api/user/wishlist", { userId, bookKey: book.key });
      }
      await mutate(`/api/user/${userId}`);
    } catch (error) {
      console.error("Erreur lors de la modification de la wishlist:", error);
    }
  };

  return {
    books: data?.docs || [],
    isLoading,
    isError: !!error,
    isUserLoading,
    isInLibrary,
    isInWishlist,
    toggleLibrary,
    toggleWishlist,
  };
}
