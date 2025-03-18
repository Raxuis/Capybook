"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Book as BookIcon, Heart, Trash2, BookOpen, Globe, Loader2, BookMarked, BookCopy, FileText} from "lucide-react";
import Image from "next/image";
import {useBooks} from "@/hooks/useBooks";
import {formatList} from "@/utils/formatList";
import React, {useMemo, useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {motion} from "motion/react";
import {MoreInfoBook} from "@/types";

interface BookModalProps {
    book: MoreInfoBook | null;
    userId?: string;
    isOpen: boolean;
    onClose: () => void;
    isLoading?: boolean;
}

const BookModal = ({
                       book,
                       userId,
                       isOpen,
                       onClose,
                       isLoading = false,
                   }: BookModalProps) => {
    const {
        isBookFinished,
        isInLibrary,
        isInWishlist,
        isCurrentBook,
        toggleLibrary,
        toggleWishlist,
        toggleCurrentBook
    } = useBooks(undefined, userId);


    const bookStatus = useMemo(() => {
        if (!book) return {
            inLibrary: false,
            inWishlist: false,
            isCurrentBookInstance: false,
            isBookFinishedInstance: false
        };

        return {
            inLibrary: isInLibrary(book.key),
            inWishlist: isInWishlist(book.key),
            isCurrentBookInstance: isCurrentBook(book.key),
            isBookFinishedInstance: isBookFinished(book.key)
        };
    }, [book, isInLibrary, isInWishlist, isCurrentBook, isBookFinished]);

    const [loadingLibrary, setLoadingLibrary] = useState(false);
    const [loadingWishlist, setLoadingWishlist] = useState(false);
    const [loadingCurrentBook, setLoadingCurrentBook] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClose = () => {
        setIsAnimating(true);
        setTimeout(() => {
            onClose();
            setIsAnimating(false);
        }, 350);
    };

    const handleToggleLibrary = async () => {
        if (!book) return;
        setLoadingLibrary(true);
        try {
            await toggleLibrary(book);
        } catch (error) {
            console.error("Error toggling library status:", error);
        } finally {
            setLoadingLibrary(false);
        }
    };

    const handleToggleWishlist = async () => {
        if (!book) return;
        setLoadingWishlist(true);
        try {
            await toggleWishlist(book);
        } catch (error) {
            console.error("Error toggling wishlist status:", error);
        } finally {
            setLoadingWishlist(false);
        }
    };

    const handleToggleCurrentBook = async () => {
        if (!book) return;
        setLoadingCurrentBook(true);
        try {
            await toggleCurrentBook(book);
        } catch (error) {
            console.error("Error setting current book:", error);
        } finally {
            setLoadingCurrentBook(false);
        }
    };

    const {isBookFinishedInstance, inLibrary, inWishlist, isCurrentBookInstance} = bookStatus;

    return (
        <motion.div
            initial={{opacity: 0, scale: 0.9, y: 20}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.9, y: 20}}
            transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.3
            }}>
            <Dialog open={isOpen || isAnimating} onOpenChange={(open) => !open && handleClose()}>
                <DialogContent
                    className="sm:max-w-md md:max-w-lg lg:max-w-xl"
                >
                    <DialogHeader>
                        {isLoading ? (
                            <>
                                <Skeleton className="h-7 w-3/4 mb-2"/>
                                <DialogTitle className="sr-only">
                                    Chargement...
                                </DialogTitle>
                                <Skeleton className="h-4 w-full mb-1"/>
                                <Skeleton className="h-4 w-2/3"/>
                                <DialogDescription className="sr-only">
                                    Chargement...
                                </DialogDescription>
                            </>
                        ) : (
                            <>
                                <DialogTitle
                                    className="text-xl font-bold pr-8">{book?.title || "Détails du livre"}</DialogTitle>
                                {book?.description && (
                                    <DialogDescription className="max-h-32 overflow-y-auto text-muted-foreground">
                                        <span>{book.description}</span>
                                    </DialogDescription>
                                )}
                            </>
                        )}
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Image/Couverture */}
                        <div
                            className="aspect-[2/3] relative bg-gray-100 rounded-md overflow-hidden max-h-96 mx-auto w-full sm:max-w-[200px]">
                            {isLoading ? (
                                <Skeleton className="w-full h-full"/>
                            ) : book?.cover ? (
                                <Image
                                    src={book.cover}
                                    alt={book.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 200px"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <BookOpen className="h-16 w-16 text-gray-300"/>
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            {/* Auteurs */}
                            {isLoading ? (
                                <div>
                                    <Skeleton className="h-4 w-24 mb-2"/>
                                    <Skeleton className="h-5 w-3/4"/>
                                </div>
                            ) : book?.authors && book.authors.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Auteur(s)</h3>
                                    <p>{formatList(book.authors)}</p>
                                </div>
                            )}

                            {/* Nombre de pages */}
                            {isLoading ? (
                                <div>
                                    <Skeleton className="h-4 w-24 mb-2"/>
                                    <Skeleton className="h-5 w-20"/>
                                </div>
                            ) : book?.numberOfPages && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                                        <FileText className="h-4 w-4 mr-1"/>
                                        Nombre de page <span>{book.numberOfPages > 1 && "s"}</span>
                                    </h3>
                                    <p>{book.numberOfPages} pages</p>
                                </div>
                            )}

                            {/* Genres/Sujets */}
                            {isLoading ? (
                                <div>
                                    <Skeleton className="h-4 w-24 mb-2"/>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        <Skeleton className="h-6 w-16 rounded-full"/>
                                        <Skeleton className="h-6 w-20 rounded-full"/>
                                        <Skeleton className="h-6 w-24 rounded-full"/>
                                    </div>
                                </div>
                            ) : book?.subjects && book.subjects.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                                        <Globe className="h-4 w-4 mr-1"/>
                                        Genres(s)
                                    </h3>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {book.subjects.slice(0, 5).map((subject, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs max-w-24">
                                                {subject.length > 10 ? subject.substring(0, 10) + '...' : subject}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Statut */}
                            {isLoading ? (
                                <div>
                                    <Skeleton className="h-4 w-24 mb-2"/>
                                    <Skeleton className="h-6 w-40 rounded-full"/>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-gray-500">Statut du livre</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {inLibrary && (
                                                <Badge variant="outline"
                                                       className="bg-primary/10 text-primary flex items-center gap-1">
                                                    <BookIcon className="h-3 w-3"/>
                                                    Dans ma bibliothèque
                                                </Badge>
                                            )}
                                            {inWishlist && (
                                                <Badge variant="outline"
                                                       className="bg-rose-50 text-rose-600 flex items-center gap-1">
                                                    <Heart className="h-3 w-3"/>
                                                    Dans ma wishlist
                                                </Badge>
                                            )}
                                            {!inLibrary && !inWishlist && (
                                                <Badge variant="outline" className="text-gray-500">
                                                    Non ajouté
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {
                                            (!inWishlist && inLibrary) && (
                                                <h3 className="text-sm font-medium text-gray-500">Statut de lecture</h3>
                                            )
                                        }
                                        <div className="flex flex-wrap gap-2">
                                            {isCurrentBookInstance ? (
                                                <Badge variant="outline"
                                                       className="bg-indigo-100 text-indigo-600 flex items-center gap-1">
                                                    <BookMarked className="h-3 w-3"/>
                                                    En cours de lecture
                                                </Badge>
                                            ) : inLibrary ?
                                                isBookFinishedInstance ?
                                                    (
                                                        <Badge variant="outline"
                                                               className="bg-green-100 text-green-600 flex items-center gap-1">
                                                            <BookCopy className="h-3 w-3"/>
                                                            Terminé
                                                        </Badge>
                                                    )
                                                    : (
                                                        <Badge variant="outline"
                                                               className="text-gray-500 flex items-center gap-1">
                                                            <BookCopy className="h-3 w-3"/>
                                                            Non commencé
                                                        </Badge>
                                                    ) : null}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row flex-wrap mt-4 sm:justify-start">
                        {isLoading ? (
                            <>
                                <Skeleton className="h-10 w-full sm:w-40 rounded-md"/>
                                <Skeleton className="h-10 w-full sm:w-40 rounded-md"/>
                            </>
                        ) : (
                            <>
                                {(inLibrary && !isCurrentBookInstance && !isBookFinishedInstance) && (
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto hover:bg-indigo-200 border-indigo-300 text-indigo-700"
                                        onClick={handleToggleCurrentBook}
                                        disabled={loadingLibrary || loadingWishlist || loadingCurrentBook}
                                    >
                                        {loadingCurrentBook ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                                        ) : (
                                            <BookMarked className="h-4 w-4 mr-2"/>
                                        )}
                                        Marquer comme en lecture
                                    </Button>
                                )}
                                {inLibrary && isCurrentBookInstance && (
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto hover:bg-gray-200 border-gray-300"
                                        onClick={handleToggleCurrentBook}
                                        disabled={loadingLibrary || loadingWishlist || loadingCurrentBook}
                                    >
                                        {loadingCurrentBook ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                                        ) : (
                                            <BookCopy className="h-4 w-4 mr-2"/>
                                        )}
                                        Marquer comme non commencé
                                    </Button>
                                )}
                                {inLibrary && (
                                    <Button
                                        variant="destructive"
                                        className="w-full sm:w-auto"
                                        onClick={handleToggleLibrary}
                                        disabled={loadingLibrary || loadingWishlist || loadingCurrentBook}
                                    >
                                        {loadingLibrary ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                                        ) : (
                                            <Trash2 className="h-4 w-4 mr-2"/>
                                        )}
                                        Retirer de ma bibliothèque
                                    </Button>
                                )}
                                {inWishlist && (
                                    <Button
                                        variant="destructive"
                                        className="w-full sm:w-auto"
                                        onClick={handleToggleWishlist}
                                        disabled={loadingLibrary || loadingWishlist || loadingCurrentBook}
                                    >
                                        {loadingWishlist ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                                        ) : (
                                            <Trash2 className="h-4 w-4 mr-2"/>
                                        )}
                                        Retirer de ma wishlist
                                    </Button>
                                )}
                                {!inLibrary && !inWishlist && (
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto hover:bg-green-300"
                                        onClick={handleToggleLibrary}
                                        disabled={loadingLibrary || loadingWishlist || loadingCurrentBook}
                                    >
                                        {loadingLibrary ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                                        ) : (
                                            <BookIcon className="h-4 w-4 mr-2"/>
                                        )}
                                        Ajouter à ma bibliothèque
                                    </Button>
                                )}
                                {!inWishlist && !inLibrary && (
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-auto hover:bg-amber-300"
                                        onClick={handleToggleWishlist}
                                        disabled={loadingLibrary || loadingWishlist || loadingCurrentBook}
                                    >
                                        {loadingWishlist ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                                        ) : (
                                            <Heart className="h-4 w-4 mr-2"/>
                                        )}
                                        Ajouter à ma wishlist
                                    </Button>
                                )}
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

export default BookModal;