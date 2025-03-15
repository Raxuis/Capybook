"use client";
import {useEffect, useState} from "react";
import {useBooks} from "@/hooks/useBooks";
import {useQueryState} from "nuqs";
import {Input} from "@/components/ui/input";
import {useDebounce} from "@uidotdev/usehooks";
import BookCard from "@/components/BookStore/BookCard";
import {Search, Barcode} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import {Link} from "next-view-transitions";
import ReviewBookModal from "@/components/BookStore/Modals/ReviewBookModal";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

interface BookStoreProps {
    userId: string | null;
}

const BookStore = ({userId}: BookStoreProps) => {
    const [search, setSearch] = useQueryState("search", {defaultValue: ""});
    const [searchType, setSearchType] = useQueryState("type", {defaultValue: ""});
    const debouncedSearch = useDebounce(search, 500);
    const {
        books,
        isError,
        isLoading,
    } = useBooks(debouncedSearch, userId ?? undefined, searchType);
    const [searchFocused, setSearchFocused] = useState<boolean>(false);

    const handleSearchTypeChange = (value: string): void => {
        setSearchType(value);
        setSearch("");
    };

    useEffect(() => {
        if (searchType === "isbn") {
            setSearchType("isbn");
        } else {
            setSearchType("general");
        }
    }, [searchType, setSearchType]);

    return (
        <div className="container max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">
                Parcourir les livres
            </h1>

            <Tabs defaultValue="general" value={searchType} onValueChange={handleSearchTypeChange} className="mb-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="general">Titre / Auteur</TabsTrigger>
                    <TabsTrigger value="isbn">ISBN</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-4">
                    <div className="relative">
                        <div
                            className={`flex items-center border rounded-lg px-3 transition-all ${searchFocused ? 'ring-2 ring-primary shadow-sm' : 'border-gray-300'}`}>
                            <Search className="h-5 w-5 text-gray-400 mr-2"/>
                            <Input
                                value={search || ""}
                                onChange={(e) => setSearch(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                placeholder="Recherchez un livre par titre, auteur..."
                                className="border-0 shadow-none focus-visible:ring-0 focus-visible:outline-none"
                            />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="isbn" className="mt-4">
                    <div className="relative">
                        <div
                            className={`flex items-center border rounded-lg px-3 transition-all ${searchFocused ? 'ring-2 ring-primary shadow-sm' : 'border-gray-300'}`}>
                            <Barcode className="h-5 w-5 text-gray-400 mr-2"/>
                            <Input
                                value={search || ""}
                                onChange={(e) => {
                                    // Limiter aux chiffres et tirets pour ISBN
                                    const value = e.target.value.replace(/[^0-9\-]/g, '');
                                    setSearch(value);
                                }}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                placeholder="Entrez un ISBN (ex: 978-3-16-148410-0)"
                                className="border-0 shadow-none focus-visible:ring-0 focus-visible:outline-none"
                                inputMode="numeric"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-1">
                            Format: ISBN-10 ou ISBN-13 (avec ou sans tirets)
                        </p>
                    </div>
                </TabsContent>
            </Tabs>

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
                            debouncedBookName={debouncedSearch || ""}
                            userId={userId}
                        />
                    ))}
                </div>
            ) : (search || "").trim() !== "" ? (
                <div className="mt-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        {searchType === "isbn" ?
                            <Barcode className="h-8 w-8 text-gray-400"/> :
                            <Search className="h-8 w-8 text-gray-400"/>
                        }
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Aucun livre trouvé</h3>
                    <p className="text-gray-500 max-w-md">
                        {searchType === "isbn" ?
                            `Aucun livre ne correspond à l'ISBN "${search}". Vérifiez que le format est correct.` :
                            `Aucun livre ne correspond à votre recherche "${search}". Essayez avec un autre titre ou auteur.`
                        }
                    </p>
                </div>
            ) : (
                <div className="mt-16 flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-semibold mb-2">Commencez votre recherche</h3>
                    <p className="text-gray-500 max-w-md">
                        {searchType === "isbn" ?
                            "Entrez un ISBN pour trouver un livre spécifique." :
                            "Recherchez des livres par titre ou auteur pour les ajouter à "
                        }
                        {searchType !== "isbn" && (
                            <Link href="/book-shelf" className="text-primary underline">
                                votre bibliothèque
                            </Link>
                        )}
                        {searchType !== "isbn" && "."}
                    </p>
                </div>
            )}
            <ReviewBookModal userId={userId}/>
        </div>
    );
};

export default BookStore;