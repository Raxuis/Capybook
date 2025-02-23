"use client";

import React, { useEffect } from "react";
import { useBooks } from "@/hooks/useBooks";
import { useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@uidotdev/usehooks";
import BookCard from "@/components/Dashboard/Book/BookCard";

const BookShelf = ({ userId }: { userId: string | null }) => {
  const [bookNameQuery, setBookNameQuery] = useQueryState("");
  const debouncedBookName = useDebounce(bookNameQuery, 500);

  const {
    books,
    isError,
    isLoading,
    toggleLibrary,
    toggleWishlist,
    isInLibrary,
    isInWishlist
  } = useBooks(debouncedBookName, userId ?? undefined);

  useEffect(() => {
    console.log(books);
  }, [books]);

  return (
    <div className="flex flex-col gap-8">
      <Input
        value={bookNameQuery || ""}
        onChange={(e) => setBookNameQuery(e.target.value)}
        placeholder="Search for a book..."
        className="mt-4"
      />
      {isError && <p>Erreur lors de la recherche.</p>}
      {isLoading ? (
        <p>Chargement...</p>
      ) : books.length > 0 ? (
        <div className="flex flex-col gap-4">
          {
            books.map((book) => (
              <BookCard
                key={book.key}
                book={book}
                toggleLibrary={toggleLibrary}
                toggleWishlist={toggleWishlist}
                isInLibrary={isInLibrary(book.key) ?? false}
                isInWishlist={isInWishlist(book.key) ?? false}
              />
            ))
          }
        </div>
      ) : (bookNameQuery || "").trim() !== "" ? (
        <p>Aucun livre ne correspond à votre recherche</p>
      ) : null}
    </div>
  );
};

export default BookShelf;
