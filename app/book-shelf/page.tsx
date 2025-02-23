"use client";

import React, {useEffect} from "react";
import {useBooks} from "@/hooks/useBooks";
import {useQueryState} from "nuqs";
import {Input} from "@/components/ui/input";
import {useDebounce} from "@uidotdev/usehooks";
import BookCard from "@/components/Dashboard/Book/BookCard";

const BookShelf = () => {
    const [bookNameQuery, setBookNameQuery] = useQueryState("");
    const debouncedBookName = useDebounce(bookNameQuery, 500);
    const {books, isError, isLoading} = useBooks(debouncedBookName);

    useEffect(() => {
        console.log(books)
    }, [books]);

    return (
        <>
            <Input
                value={bookNameQuery || ""}
                onChange={(e) => setBookNameQuery(e.target.value)}
                placeholder="Search for a book..."
            />
            {isError && <p>Erreur lors de la recherche.</p>}
            {isLoading ? (
                <p>Chargement...</p>
            ) : books.length > 0 ? (
                books.map((book) => (
                    <BookCard book={book} key={book.key}/>
                ))
            ) : (bookNameQuery || "").trim() !== "" ?
                (
                    <p>Aucun livre ne correspond à votre recherche</p>
                ) : null
            }
        </>
    );
};

export default BookShelf;
