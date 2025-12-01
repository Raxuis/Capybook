"use client";
import {useState} from "react";
import {useBooks} from "@/hooks/useBooks";
import {useQueryState} from "nuqs";
import {Input} from "@/components/ui/input";
import {useDebounce} from "@uidotdev/usehooks";
import BookCard from "@/components/BookStore/BookCard";
import {Search, ChevronLeft, ChevronRight, BookOpen} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import {Link} from "next-view-transitions";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {motion, AnimatePresence} from "motion/react";
import {ErrorState, EmptyState} from "@/components/common";

const BookStore = () => {
    const [search, setSearch] = useQueryState("search", {defaultValue: ""});
    const [page, setPage] = useQueryState("page", {defaultValue: "1"});
    const debouncedSearch = useDebounce(search, 500);
    const {
        books,
        isError,
        isLoading,
        totalPages,
        currentPage
    } = useBooks(debouncedSearch, parseInt(page));

    const [searchFocused, setSearchFocused] = useState<boolean>(false);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage.toString());
        }
    };

    return (
        <div className="container mx-auto max-w-6xl px-4 pb-28 pt-8">
            <motion.h1 className="mb-3 text-3xl font-bold"
                       initial={{opacity: 0, y: 20}}
                       animate={{opacity: 1, y: 0}}
                       transition={{duration: 0.6, ease: "easeInOut"}}
            >
                Parcourir les livres
            </motion.h1>
            <motion.div className="relative" initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, ease: "easeIn"}}
            >
                <div
                    className={cn("flex items-center border rounded-lg px-3 transition-all", searchFocused ? 'ring-2 ring-primary shadow-sm' : 'border-gray-300')}>
                    <Search className="mr-2 size-5 text-gray-400"/>
                    <Input
                        value={search || ""}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage("1"); // Réinitialiser la page lors d'une nouvelle recherche
                        }}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        placeholder="Recherchez un livre par titre, ISBN, auteur..."
                        className="border-0 shadow-none focus-visible:outline-none focus-visible:ring-0"
                    />
                </div>
            </motion.div>
            {isError && (
                <ErrorState
                    title="Erreur de recherche"
                    message="Une erreur est survenue lors de la recherche. Veuillez réessayer."
                    onRetry={() => window.location.reload()}
                    className="mt-8"
                />
            )}

            {isLoading ? (
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="overflow-hidden rounded-lg border">
                            <Skeleton className="h-64 w-full"/>
                            <div className="p-4">
                                <Skeleton className="mb-2 h-6 w-3/4"/>
                                <Skeleton className="mb-4 h-4 w-1/2"/>
                                <Skeleton className="mb-2 h-4 w-full"/>
                                <Skeleton className="h-4 w-3/4"/>
                            </div>
                        </div>
                    ))}
                </div>
            ) : books.length > 0 ? (
                <>
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {books.map((book) => (
                            <BookCard
                                key={book.key}
                                book={book}
                                debouncedBookName={debouncedSearch || ""}
                            />
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-4">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="size-4"/>
                            </Button>
                            <span className="text-muted-foreground text-sm">
                                Page {currentPage} sur {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="size-4"/>
                            </Button>
                        </div>
                    )}
                </>
            ) : (search || "").trim() !== "" ? (
                <EmptyState
                    icon={Search}
                    title="Aucun livre trouvé"
                    message={`Aucun livre ne correspond à votre recherche "${search}". Essayez avec un autre titre, auteur ou ISBN.`}
                    className="mt-8"
                />
            ) : (
                <AnimatePresence mode="wait">
                    {search.trim() === "" && books.length === 0 && !isLoading && !isError && (
                        <motion.div
                            key="initial-prompt"
                            className="mt-8"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 10}}
                            transition={{duration: 0.6, delay: 0.3, ease: "easeInOut"}}
                        >
                            <EmptyState
                                icon={BookOpen}
                                title="Commencez votre recherche"
                                message={
                                    <>
                                        Recherchez des livres par titre, auteur ou ISBN pour les ajouter à{" "}
                                        <Link href="/book-shelf"
                                              className="text-primary hover:text-primary/80 underline">
                                            votre bibliothèque
                                        </Link>
                                        .
                                    </>
                                }
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
};

export default BookStore;
