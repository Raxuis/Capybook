"use client";
import React, {useEffect, useState} from "react";
import {useBooks} from "@/hooks/useBooks";
import {useQueryState} from "nuqs";
import {Input} from "@/components/ui/input";
import {useDebounce} from "@uidotdev/usehooks";
import BookCard from "@/components/Dashboard/Book/BookCard";
import {Search} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";

const Library = ({userId}: { userId: string | null }) => {
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
    const [searchFocused, setSearchFocused] = useState(false);

    useEffect(() => {
        console.log(books);
    }, [books]);

    return (
        <div className="container max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Ma Bibliothèque</h1>

            <div className="relative">
                <div
                    className={`flex items-center border rounded-lg px-3 transition-all ${searchFocused ? 'ring-2 ring-primary shadow-sm' : 'border-gray-300'}`}>
                    <Search className="h-5 w-5 text-gray-400 mr-2"/>
                    <Input
                        value={bookNameQuery || ""}
                        onChange={(e) => setBookNameQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        placeholder="Recherchez un livre par titre, auteur..."
                        className="border-0 shadow-none focus-visible:ring-0 focus-visible:outline-none"
                    />
                </div>
            </div>

            {isError && (
                <div className="mt-8 p-4 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                    <p>Une erreur est survenue lors de la recherche. Veuillez réessayer.</p>
                </div>
            )}

            {isLoading ? (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                            <Skeleton className="h-64 w-full"/>
                            <div className="p-4">
                                <Skeleton className="h-6 w-3/4 mb-2"/>
                                <Skeleton className="h-4 w-1/2 mb-4"/>
                                <Skeleton className="h-4 w-full mb-2"/>
                                <Skeleton className="h-4 w-3/4"/>
                            </div>
                        </div>
                    ))}
                </div>
            ) : books.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {books.map((book) => (
                        <BookCard
                            key={book.key}
                            book={book}
                            toggleLibrary={toggleLibrary}
                            toggleWishlist={toggleWishlist}
                            isInLibrary={isInLibrary(book.key) || false}
                            isInWishlist={isInWishlist(book.key) || false}
                        />
                    ))}
                </div>
            ) : (bookNameQuery || "").trim() !== "" ? (
                <div className="mt-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="h-8 w-8 text-gray-400"/>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Aucun livre trouvé</h3>
                    <p className="text-gray-500 max-w-md">
                        Aucun livre ne correspond à votre recherche &#34;{bookNameQuery}&#34;. Essayez avec un autre titre ou
                        auteur.
                    </p>
                </div>
            ) : (
                <div className="mt-16 flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-semibold mb-2">Commencez votre recherche</h3>
                    <p className="text-gray-500 max-w-md">
                        Recherchez des livres par titre ou auteur pour les ajouter à votre bibliothèque.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Library;