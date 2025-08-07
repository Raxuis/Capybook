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
import {
    Book as BookIcon,
    Heart,
    Trash2,
    BookOpen,
    Globe,
    Loader2,
    BookMarked,
    BookCopy,
    FileText,
    Users,
    UserCheck,
    Clock
} from "lucide-react";
import Image from "next/image";
import {useBooks} from "@/hooks/useBooks";
import {useUser} from "@/hooks/useUser";
import {formatList} from "@/utils/format";
import React, {useMemo, useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {motion} from "motion/react";
import {MoreInfoBook} from "@/types";
import BookNotesModal from "./Notes/BookNotesModal";
import LendingModal from "./Lending/LendingModal";

interface BookModalProps {
    book: MoreInfoBook | null;
    isOpen: boolean;
    onClose: () => void;
    isLoading?: boolean;
    userId: string;
}

const BookModal = ({
                       book,
                       isOpen,
                       onClose,
                       isLoading = false,
                       userId
                   }: BookModalProps) => {
    const [isNotesModalOpened, setIsNotesModalOpened] = useState<boolean>(false);
    const [isLendingModalOpened, setIsLendingModalOpened] = useState<boolean>(false);
    const {
        isBookFinished,
        isInLibrary,
        isInWishlist,
        isCurrentBook,
        isBookLoaned,
        isBookPendingLoan,
        toggleLibrary,
        toggleWishlist,
        toggleCurrentBook,
        lendBook,
        cancelLending,
        getNotesCount
    } = useBooks(undefined);

    const {user} = useUser();

    const bookStatus = useMemo(() => {
        if (!book) return {
            inLibrary: false,
            inWishlist: false,
            isCurrentBookInstance: false,
            isBookFinishedInstance: false,
            isBookLoanedInstance: false,
            isPendingLoanInstance: false
        };

        return {
            inLibrary: isInLibrary(book.key),
            inWishlist: isInWishlist(book.key),
            isCurrentBookInstance: isCurrentBook(book.key),
            isBookFinishedInstance: isBookFinished(book.key),
            isBookLoanedInstance: isBookLoaned(book.key),
            isPendingLoanInstance: isBookPendingLoan(book.key)
        };
    }, [book, isInLibrary, isInWishlist, isCurrentBook, isBookFinished, isBookLoaned, isBookPendingLoan]);

    // Informations de prêt
    const lendingInfo = useMemo(() => {
        if (!user?.lentBooks || !book || (!bookStatus.isBookLoanedInstance && !bookStatus.isPendingLoanInstance)) return null;

        return user.lentBooks.find(
            lending => lending.book.key === book.key &&
                (lending.status === 'ACCEPTED' || lending.status === 'PENDING') &&
                !lending.returnedAt
        );
    }, [user?.lentBooks, book, bookStatus.isBookLoanedInstance, bookStatus.isPendingLoanInstance]);

    const [loadingLibrary, setLoadingLibrary] = useState(false);
    const [loadingWishlist, setLoadingWishlist] = useState(false);
    const [loadingCurrentBook, setLoadingCurrentBook] = useState(false);
    const [loadingLending, setLoadingLending] = useState(false);
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

    const handleLendBook = async (borrowerId: string, message?: string) => {
        if (!book) return;
        setLoadingLending(true);
        try {
            await lendBook(book, borrowerId, message);
            setIsLendingModalOpened(false);
        } catch (error) {
            console.error("Error lending book:", error);
        } finally {
            setLoadingLending(false);
        }
    };

    const handleCancelLending = async () => {
        if (!book) return;
        setLoadingLending(true);
        try {
            await cancelLending(book.key);
        } catch (error) {
            console.error("Error cancelling lending:", error);
        } finally {
            setLoadingLending(false);
        }
    };

    const notesCount = getNotesCount(book?.key || "");

    const {
        isBookFinishedInstance,
        inLibrary,
        inWishlist,
        isCurrentBookInstance,
        isBookLoanedInstance,
        isPendingLoanInstance
    } = bookStatus;

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
                    className="max-h-[90vh] w-full overflow-y-auto sm:max-w-md md:max-w-lg lg:max-w-xl"
                >
                    <DialogHeader className="space-y-2">
                        <DialogTitle
                            className="break-words text-xl font-bold">{book?.title || "Détails du livre"}</DialogTitle>
                        {
                            isLoading ? (
                                <>
                                    <Skeleton className="mb-1 h-4 w-full"/>
                                    <DialogDescription className="sr-only">
                                        Chargement...
                                    </DialogDescription>
                                </>
                            ) : book?.description ? (
                                //   Limiting description max length to 200 characters
                                <DialogDescription
                                    className="overflow-wrap-anywhere w-3/4 overflow-hidden break-words text-sm text-gray-500">
                                    {book.description.length > 200
                                        ? book.description.substring(0, 200) + "..."
                                        : book.description}
                                </DialogDescription>
                            ) : (
                                <DialogDescription>
                                    <span className="text-sm text-gray-500">Aucune description disponible</span>
                                </DialogDescription>
                            )
                        }
                    </DialogHeader>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {/* Image/Couverture */}
                        <div
                            className="relative mx-auto aspect-[2/3] max-h-96 w-full overflow-hidden rounded-md bg-gray-100 sm:max-w-[200px]">
                            {book?.cover ? (
                                <Image
                                    src={book.cover}
                                    alt={book.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 200px"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="flex size-full items-center justify-center">
                                    <BookOpen className="size-16 text-gray-300"/>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 md:col-span-2">
                            {/* Auteurs */}
                            {book?.authors && book.authors.length > 0 && (
                                <div>
                                    <h3 className="mb-1 text-sm font-medium text-gray-500">Auteur(s)</h3>
                                    <p className="flex-wrap break-words">{formatList(book.authors)}</p>
                                </div>
                            )}

                            {/* Nombre de pages */}
                            {book?.numberOfPages && (
                                <div>
                                    <h3 className="mb-1 flex items-center text-sm font-medium text-gray-500">
                                        <FileText className="mr-1 size-4"/>
                                        Nombre de page <span>{book.numberOfPages > 1 && "s"}</span>
                                    </h3>
                                    <p>{book.numberOfPages} pages</p>
                                </div>
                            )}

                            {/* Genres/Sujets */}
                            {
                                isLoading ? (
                                    <Skeleton className="mb-1 h-4 w-full"/>
                                ) : book?.subjects && book.subjects.length === 0 ? (
                                    <p className="text-sm text-gray-500">Aucun genre disponible</p>
                                ) : book?.subjects && book.subjects.length > 0 ? (
                                    <div>
                                        <h3 className="mb-1 flex items-center text-sm font-medium text-gray-500">
                                            <Globe className="mr-1 size-4"/>
                                            Genres(s)
                                        </h3>
                                        <div className="mt-1 flex w-full flex-wrap gap-1">
                                            {book.subjects.slice(0, 5).map((subject, idx) => (
                                                <Badge key={idx} variant="secondary"
                                                       className="max-w-24 truncate text-xs">
                                                    {subject.length > 10 ? subject.substring(0, 10) + '...' : subject}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}

                            {/* Statut */}
                            {(
                                <div className="grid grid-cols-1 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-gray-500">Statut du livre</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {inLibrary && (
                                                <Badge variant="outline"
                                                       className="bg-primary/10 text-primary flex items-center gap-1">
                                                    <BookIcon className="size-3"/>
                                                    Dans ma bibliothèque
                                                </Badge>
                                            )}
                                            {inWishlist && (
                                                <Badge variant="outline"
                                                       className="flex items-center gap-1 bg-rose-50 text-rose-600">
                                                    <Heart className="size-3"/>
                                                    Dans ma wishlist
                                                </Badge>
                                            )}
                                            {isBookLoanedInstance && (
                                                <Badge variant="outline"
                                                       className="flex items-center gap-1 border-orange-200 bg-orange-50 text-orange-700">
                                                    <UserCheck className="size-3"/>
                                                    Prêté
                                                </Badge>
                                            )}
                                            {isPendingLoanInstance && (
                                                <Badge variant="outline"
                                                       className="flex items-center gap-1 border-yellow-200 bg-yellow-50 text-yellow-700">
                                                    <Clock className="size-3"/>
                                                    Prêt en attente
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
                                                       className="flex items-center gap-1 bg-indigo-100 text-indigo-600">
                                                    <BookMarked className="size-3"/>
                                                    En cours de lecture
                                                </Badge>
                                            ) : inLibrary ?
                                                isBookFinishedInstance ?
                                                    (
                                                        <Badge variant="outline"
                                                               className="flex items-center gap-1 bg-green-100 text-green-600">
                                                            <BookCopy className="size-3"/>
                                                            Terminé
                                                        </Badge>
                                                    )
                                                    : (
                                                        <Badge variant="outline"
                                                               className="flex items-center gap-1 text-gray-500">
                                                            <BookCopy className="size-3"/>
                                                            Non commencé
                                                        </Badge>
                                                    ) : null}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Informations de prêt */}
                    {(isBookLoanedInstance || isPendingLoanInstance) && lendingInfo && (
                        <div
                            className={`${isPendingLoanInstance ? 'border-yellow-200 bg-yellow-50' : 'border-orange-200 bg-orange-50'} space-y-2 rounded-lg border p-4`}>
                            <div
                                className={`flex items-center gap-2 ${isPendingLoanInstance ? 'text-yellow-700' : 'text-orange-700'}`}>
                                <UserCheck className="size-4"/>
                                <span className="font-medium">
                                    {isPendingLoanInstance
                                        ? 'Demande de prêt en attente'
                                        : `Prêté à ${lendingInfo.borrower.name || lendingInfo.borrower.username}`
                                    }
                                </span>
                            </div>
                            {lendingInfo.acceptedAt && (
                                <p className={`${isPendingLoanInstance ? 'text-yellow-600' : 'text-orange-600'} text-sm`}>
                                    Depuis le {new Date(lendingInfo.acceptedAt).toLocaleDateString('fr-FR')}
                                </p>
                            )}
                            {lendingInfo.dueDate && (
                                <p className={`${isPendingLoanInstance ? 'text-yellow-600' : 'text-orange-600'} text-sm`}>
                                    À retourner le {new Date(lendingInfo.dueDate).toLocaleDateString('fr-FR')}
                                </p>
                            )}
                        </div>
                    )}

                    <DialogFooter className="mt-4 flex flex-col flex-wrap sm:flex-row sm:justify-start">
                        {/* Bouton pour marquer comme en lecture */}
                        {(inLibrary && !isCurrentBookInstance && !isBookFinishedInstance && !isBookLoanedInstance && !isPendingLoanInstance) && (
                            <Button
                                variant="outline"
                                className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-200 sm:w-auto"
                                onClick={handleToggleCurrentBook}
                                disabled={loadingLibrary || loadingWishlist || loadingCurrentBook || loadingLending}
                            >
                                {loadingCurrentBook ? (
                                    <Loader2 className="mr-2 size-4 animate-spin"/>
                                ) : (
                                    <BookMarked className="mr-2 size-4"/>
                                )}
                                Marquer comme en lecture
                            </Button>
                        )}

                        {/* Bouton pour marquer comme non commencé */}
                        {(inLibrary && isCurrentBookInstance && !isBookLoanedInstance && !isPendingLoanInstance) && (
                            <Button
                                variant="outline"
                                className="w-full border-gray-300 hover:bg-gray-200 sm:w-auto"
                                onClick={handleToggleCurrentBook}
                                disabled={loadingLibrary || loadingWishlist || loadingCurrentBook || loadingLending}
                            >
                                {loadingCurrentBook ? (
                                    <Loader2 className="mr-2 size-4 animate-spin"/>
                                ) : (
                                    <BookCopy className="mr-2 size-4"/>
                                )}
                                Marquer comme non commencé
                            </Button>
                        )}

                        {/* Bouton pour prêter le livre */}
                        {(inLibrary && !isBookLoanedInstance && !isPendingLoanInstance) && (
                            <Button
                                variant="outline"
                                className="w-full border-blue-300 text-blue-700 hover:bg-blue-200 sm:w-auto"
                                onClick={() => setIsLendingModalOpened(true)}
                                disabled={loadingLibrary || loadingWishlist || loadingCurrentBook || loadingLending}
                            >
                                {loadingLending ? (
                                    <Loader2 className="mr-2 size-4 animate-spin"/>
                                ) : (
                                    <Users className="mr-2 size-4"/>
                                )}
                                Prêter ce livre
                            </Button>
                        )}

                        {/* Bouton pour marquer comme rendu */}
                        {(inLibrary && (isBookLoanedInstance || isPendingLoanInstance)) && (
                            <Button
                                variant="outline"
                                className="w-full border-orange-300 text-orange-700 hover:bg-orange-200 sm:w-auto"
                                onClick={handleCancelLending}
                                disabled={loadingLibrary || loadingWishlist || loadingCurrentBook || loadingLending}
                            >
                                {loadingLending ? (
                                    <Loader2 className="mr-2 size-4 animate-spin"/>
                                ) : (
                                    <UserCheck className="mr-2 size-4"/>
                                )}
                                {isPendingLoanInstance ? 'Annuler la demande' : 'Marquer comme rendu'}
                            </Button>
                        )}

                        {/* Bouton pour retirer de la bibliothèque */}
                        {inLibrary && (
                            <Button
                                variant="destructive"
                                className="w-full sm:w-auto"
                                onClick={handleToggleLibrary}
                                disabled={loadingLibrary || loadingWishlist || loadingCurrentBook}
                            >
                                {loadingLibrary ? (
                                    <Loader2 className="mr-2 size-4 animate-spin"/>
                                ) : (
                                    <Trash2 className="mr-2 size-4"/>
                                )}
                                Retirer de ma bibliothèque
                            </Button>
                        )}

                        {/* Bouton pour retirer de la wishlist */}
                        {inWishlist && (
                            <Button
                                variant="destructive"
                                className="w-full sm:w-auto"
                                onClick={handleToggleWishlist}
                                disabled={loadingLibrary || loadingWishlist || loadingCurrentBook}
                            >
                                {loadingWishlist ? (
                                    <Loader2 className="mr-2 size-4 animate-spin"/>
                                ) : (
                                    <Trash2 className="mr-2 size-4"/>
                                )}
                                Retirer de ma wishlist
                            </Button>
                        )}

                        {/* Boutons pour ajouter à la bibliothèque/wishlist */}
                        {!inLibrary && !inWishlist && (
                            <>
                                <Button
                                    variant="outline"
                                    className="w-full hover:bg-green-300 sm:w-auto"
                                    onClick={handleToggleLibrary}
                                    disabled={loadingLibrary || loadingWishlist || loadingCurrentBook}
                                >
                                    {loadingLibrary ? (
                                        <Loader2 className="mr-2 size-4 animate-spin"/>
                                    ) : (
                                        <BookIcon className="mr-2 size-4"/>
                                    )}
                                    Ajouter à ma bibliothèque
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full hover:bg-amber-300 sm:w-auto"
                                    onClick={handleToggleWishlist}
                                    disabled={loadingLibrary || loadingWishlist || loadingCurrentBook}
                                >
                                    {loadingWishlist ? (
                                        <Loader2 className="mr-2 size-4 animate-spin"/>
                                    ) : (
                                        <Heart className="mr-2 size-4"/>
                                    )}
                                    Ajouter à ma wishlist
                                </Button>
                            </>
                        )}

                        {/* Bouton pour voir les notes */}
                        <Button
                            onClick={() => setIsNotesModalOpened(true)}
                            variant="notes"
                        >
                            <FileText className="mr-2 size-4"/>
                            Voir les notes
                            <span className="text-xs text-gray-500">
                                ({notesCount ? notesCount : 0})
                            </span>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal des notes */}
            {
                (book && userId) && (
                    <BookNotesModal
                        isOpen={isNotesModalOpened}
                        setIsOpen={setIsNotesModalOpened}
                        book={book}
                        userId={userId}
                    />
                )
            }

            {/* Modal de prêt */}
            {
                book && (
                    <LendingModal
                        book={book}
                        isOpen={isLendingModalOpened}
                        onClose={() => setIsLendingModalOpened(false)}
                        onLend={handleLendBook}
                        isLoading={loadingLending}
                    />
                )
            }
        </motion.div>
    );
};

export default BookModal;