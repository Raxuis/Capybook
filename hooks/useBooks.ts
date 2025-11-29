import { fetcher } from "@/lib/helpers/api";
import { useDebounce } from "@uidotdev/usehooks";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { useMemo, useCallback } from "react";
import { Book, MoreInfoBook } from "@/types";
import { api } from "@/lib/helpers/api";
import { SWR_CONFIG } from "@/constants/SWR";
import { PERTINENT_BOOK_SUBJECTS } from "@/constants/subjects";
import useSWR from "swr";

/**
 * Open Library API response type
 */
type OpenLibraryResponse = {
  docs: Book[];
  numFound: number;
  start: number;
};

/**
 * Book sets for tracking user's book states
 */
interface BookSets {
  libraryKeys: Set<string>;
  wishlistKeys: Set<string>;
  currentBookKeys: Set<string>;
  finishedBookKeys: Set<string>;
  reviewedKeys: Set<string>;
  lentBookKeys: Set<string>;
  pendingLentBookKeys: Set<string>;
  notesCounts: Map<string, number>;
}

/**
 * Hook return type
 */
export interface UseBooksReturn {
  books: Book[];
  isLoading: boolean;
  isError: boolean;
  isUserLoading: boolean;
  isBookFinished: (bookKey: string) => boolean;
  isInLibrary: (bookKey: string) => boolean;
  isInWishlist: (bookKey: string) => boolean;
  isCurrentBook: (bookKey: string) => boolean;
  isReviewed: (bookKey: string) => boolean;
  isBookLoaned: (bookKey: string) => boolean;
  isBookPendingLoan: (bookKey: string) => boolean;
  getNotesCount: (bookKey: string) => number;
  toggleLibrary: (book: Book | MoreInfoBook) => Promise<void>;
  toggleWishlist: (book: Book) => Promise<void>;
  toggleCurrentBook: (book: Book | MoreInfoBook) => Promise<void>;
  lendBook: (book: Book | MoreInfoBook, borrowerId: string, message?: string) => Promise<void>;
  cancelLending: (bookKey: string) => Promise<void>;
  updateBookProgress: (bookKey: string, progress: number) => Promise<void>;
  updateBookPageCount: (bookId: string, pageCount: number) => Promise<void>;
  updateBookProgressType: (bookKey: string, progressType: 'page' | 'percentage') => Promise<void>;
  totalBooks: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Custom hook for managing book search and user book operations
 *
 * @param bookName - Search query for books
 * @param page - Page number for pagination (default: 1)
 * @returns Book data, loading states, and book operation functions
 *
 * @example
 * ```tsx
 * const { books, isLoading, toggleLibrary } = useBooks("Harry Potter", 1);
 *
 * return (
 *   <div>
 *     {books.map(book => (
 *       <button onClick={() => toggleLibrary(book)}>
 *         {isInLibrary(book.key) ? "Remove" : "Add"}
 *       </button>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useBooks(bookName?: string | null, page: number = 1): UseBooksReturn {
  const debouncedBookName = useDebounce(bookName, 500);
  const { user, isLoading: isUserLoading, refreshUser } = useUser();

  const shouldFetch = Boolean(debouncedBookName);
  const pageSize = 20;

  const apiUrl = shouldFetch && debouncedBookName
    ? `https://openlibrary.org/search.json?q=${encodeURIComponent(debouncedBookName)}&page=${page}&limit=${pageSize}`
    : null;

  const { data, error, isLoading } = useSWR<OpenLibraryResponse>(
    apiUrl,
    fetcher,
    SWR_CONFIG
  );

  const bookSets = useMemo((): BookSets => {
    if (!user) {
      return {
        libraryKeys: new Set(),
        wishlistKeys: new Set(),
        currentBookKeys: new Set(),
        finishedBookKeys: new Set(),
        reviewedKeys: new Set(),
        lentBookKeys: new Set(),
        pendingLentBookKeys: new Set(),
        notesCounts: new Map(),
      };
    }

    const libraryKeys = new Set<string>();
    const wishlistKeys = new Set<string>();
    const currentBookKeys = new Set<string>();
    const finishedBookKeys = new Set<string>();
    const reviewedKeys = new Set<string>();
    const lentBookKeys = new Set<string>();
    const pendingLentBookKeys = new Set<string>();
    const notesCounts = new Map<string, number>();

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

    // Handle lent books
    if (user.lentBooks) {
      user.lentBooks.forEach((lending) => {
        if (lending.status === 'ACCEPTED' && !lending.returnedAt) {
          lentBookKeys.add(lending.book.key);
        } else if (lending.status === 'PENDING' && !lending.returnedAt) {
          pendingLentBookKeys.add(lending.book.key);
        }
      });
    }

    // Count notes for each book
    if (user.UserBookNotes) {
      user.UserBookNotes.forEach((note) => {
        const bookKey = note.Book.key;
        const currentCount = notesCounts.get(bookKey) || 0;
        notesCounts.set(bookKey, currentCount + 1);
      });
    }

    return {
      libraryKeys,
      wishlistKeys,
      currentBookKeys,
      finishedBookKeys,
      reviewedKeys,
      lentBookKeys,
      pendingLentBookKeys,
      notesCounts,
    };
  }, [user]);

  const isInLibrary = useCallback(
    (bookKey: string) => bookSets.libraryKeys.has(bookKey),
    [bookSets.libraryKeys]
  );

  const isInWishlist = useCallback(
    (bookKey: string) => bookSets.wishlistKeys.has(bookKey),
    [bookSets.wishlistKeys]
  );

  const isReviewed = useCallback(
    (bookKey: string) => bookSets.reviewedKeys.has(bookKey),
    [bookSets.reviewedKeys]
  );

  const isCurrentBook = useCallback(
    (bookKey: string) => bookSets.currentBookKeys.has(bookKey),
    [bookSets.currentBookKeys]
  );

  const isBookFinished = useCallback(
    (bookKey: string) => bookSets.finishedBookKeys.has(bookKey),
    [bookSets.finishedBookKeys]
  );

  const isBookLoaned = useCallback(
    (bookKey: string) => bookSets.lentBookKeys.has(bookKey),
    [bookSets.lentBookKeys]
  );

  const isBookPendingLoan = useCallback(
    (bookKey: string) => bookSets.pendingLentBookKeys.has(bookKey),
    [bookSets.pendingLentBookKeys]
  );

  const getNotesCount = useCallback(
    (bookKey: string) => bookSets.notesCounts.get(bookKey) || 0,
    [bookSets.notesCounts]
  );

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

  const getBookGenres = useCallback(async (bookKey: string): Promise<string[] | null> => {
    try {
      const response = await axios.get(`https://openlibrary.org${bookKey}.json`);
      const data = response.data;
      const subjects: string[] = data.subjects || [];

      const filteredSubjects = subjects.filter(subject =>
        PERTINENT_BOOK_SUBJECTS.some(pertinent =>
          subject.toLowerCase().includes(pertinent.toLowerCase())
        )
      );

      return filteredSubjects.length > 0 ? filteredSubjects : subjects.slice(0, 5);
    } catch (error) {
      console.error("Erreur lors de la récupération des genres:", error);
      return null;
    }
  }, []);

  const toggleLibrary = useCallback(
    async (book: Book | MoreInfoBook) => {
      if (!user?.id) return;
      try {
        if (isInLibrary(book.key)) {
          await api.delete("/user/books", {
            data: {
              userId: user.id,
              book,
            },
          });
        } else {
          if (isInWishlist(book.key)) {
            await api.delete("/user/wishlist", { data: { userId: user.id, book } });
          }

          let number_of_pages = null;

          if ('number_of_pages' in book && book.number_of_pages) {
            number_of_pages = book.number_of_pages;
          } else if ('numberOfPages' in book && book.numberOfPages) {
            number_of_pages = book.numberOfPages;
          } else {
            number_of_pages = await getBookNumberOfPages(book.key);
          }

          const genres = await getBookGenres(book.key);

          await api.post("/user/books", {
            userId: user.id,
            book: {
              ...book,
              number_of_pages,
              genres,
            },
          });
        }
        await refreshUser();
      } catch (error) {
        console.error("Erreur lors de la modification de la bibliothèque:", error);
      }
    },
    [user?.id, isInLibrary, refreshUser, isInWishlist, getBookGenres, getBookNumberOfPages]
  );

  const toggleWishlist = useCallback(
    async (book: Book) => {
      if (!user?.id) return;
      try {
        if (isInWishlist(book.key)) {
          await api.delete("/user/wishlist", { data: { userId: user.id, book } });
        } else {
          if (isInLibrary(book.key)) {
            await api.delete("/user/books", { data: { userId: user.id, book } });
          }
          await api.post("/user/wishlist", { userId: user.id, book });
        }
        await refreshUser();
      } catch (error) {
        console.error("Erreur lors de la modification de la wishlist:", error);
      }
    },
    [user, isInWishlist, isInLibrary, refreshUser]
  );

  const toggleCurrentBook = useCallback(
    async (book: Book | MoreInfoBook) => {
      if (!user?.id) return;
      try {
        const currentBook = user?.UserBook.find((ub) => ub.Book.key === book.key);
        if (currentBook && book) {
          await api.put("/user/book/current-book", {
            userId: user.id,
            bookId: book.id,
            isCurrentBook: !currentBook.isCurrentBook,
          });
        }
        await refreshUser();
      } catch (error) {
        console.error("Erreur lors de la modification du livre actuel:", error);
      }
    },
    [user, refreshUser]
  );

  const lendBook = useCallback(
    async (book: Book | MoreInfoBook, borrowerId: string, message?: string) => {
      if (!user?.id) return;
      try {
        await api.post("/book/lending", {
          lenderId: user.id,
          borrowerId,
          bookId: book.id,
          message,
        });
        await refreshUser();
      } catch (error) {
        console.error("Erreur lors du prêt du livre:", error);
        throw error;
      }
    },
    [user, refreshUser]
  );

  const cancelLending = useCallback(
    async (bookKey: string) => {
      if (!user?.id) return;
      try {
        const activeLending = user.lentBooks?.find(
          (lending) =>
            lending.book.key === bookKey &&
            !lending.returnedAt
        );

        if (activeLending) {
          await api.put(`/book/lending/${activeLending.id}/cancel`, {
            lenderId: user.id,
          });
          await refreshUser();
        }
      } catch (error) {
        console.error("Erreur lors de l'annulation du prêt:", error);
        throw error;
      }
    },
    [user, refreshUser]
  );

  const updateBookProgress = useCallback(
    async (bookKey: string, progress: number) => {
      if (!user?.id) return;
      try {
        const userBook = user?.UserBook.find((ub) => ub.Book.key === bookKey);
        if (userBook) {
          await api.put("/user/book/progress", {
            userId: user.id,
            bookId: userBook.Book.id,
            progress,
          });
          await refreshUser();
        } else {
          console.warn("No user book found");
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la progression:", error);
      }
    },
    [user, refreshUser]
  );

  const updateBookPageCount = useCallback(
    async (bookId: string, pageCount: number) => {
      if (!user?.id) return;
      try {
        await api.put("/book/page-count", {
          bookId,
          pageCount,
        });
        await refreshUser();
      } catch (error) {
        console.error("Erreur lors de la mise à jour du nombre de pages:", error);
      }
    },
    [user, refreshUser]
  );

  const updateBookProgressType = useCallback(
    async (bookKey: string, progressType: 'page' | 'percentage') => {
      if (!user?.id) return;
      try {
        const userBook = user?.UserBook.find((ub) => ub.Book.key === bookKey);
        if (userBook) {
          await api.put("/user/book/progress-type", {
            userId: user.id,
            bookId: userBook.Book.id,
            progressType,
          });
          await refreshUser();
        } else {
          console.warn("No user book found");
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du type de progression:", error);
      }
    },
    [user, refreshUser]
  );

  const books = useMemo(() => data?.docs || [], [data]);
  const totalBooks = data?.numFound || 0;
  const totalPages = Math.ceil(totalBooks / pageSize);

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
    isBookLoaned,
    isBookPendingLoan,
    getNotesCount,
    toggleLibrary,
    toggleWishlist,
    toggleCurrentBook,
    lendBook,
    cancelLending,
    updateBookProgress,
    updateBookPageCount,
    updateBookProgressType,
    totalBooks,
    totalPages,
    currentPage: page,
  };
}
