// components/BookModal/BookModal.tsx
"use client";
import React, {useMemo, useState, useCallback} from "react";
import {motion} from "motion/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {Skeleton} from "@/components/ui/skeleton";
import {useBooks} from "@/hooks/useBooks";
import {useUser} from "@/hooks/useUser";
import BookNotesModal from "../Notes/BookNotesModal";
import LendingModal from "../Lending/LendingModal";

import {BookCover} from "./BookCover";
import {BookInfo} from "./BookInfo";
import {BookStatusDisplay} from "./BookStatusDisplay";
import {LendingInfoDisplay} from "./LendingInfoDisplay";
import {BookActions} from "./BookActions";

import {BookModalProps, BookStatus, LoadingStates} from "@/types/bookModal";

const BookModal = ({
                       book,
                       isOpen,
                       onClose,
                       isLoading = false,
                       userId
                   }: BookModalProps) => {
    const [isNotesModalOpened, setIsNotesModalOpened] = useState<boolean>(false);
    const [isLendingModalOpened, setIsLendingModalOpened] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    // Loading states
    const [loadingStates, setLoadingStates] = useState<LoadingStates>({
        loadingLibrary: false,
        loadingWishlist: false,
        loadingCurrentBook: false,
        loadingLending: false,
    });

    // Hooks
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

    // Computed values
    const bookStatus: BookStatus = useMemo(() => {
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

    const lendingInfo = useMemo(() => {
        if (!user?.lentBooks || !book || (!bookStatus.isBookLoanedInstance && !bookStatus.isPendingLoanInstance)) {
            return null;
        }

        return user.lentBooks.find(
            lending => lending.book.key === book.key &&
                (lending.status === 'ACCEPTED' || lending.status === 'PENDING') &&
                !lending.returnedAt
        );
    }, [user?.lentBooks, book, bookStatus.isBookLoanedInstance, bookStatus.isPendingLoanInstance]);

    const notesCount = getNotesCount(book?.key || "");

    // Handlers
    const handleClose = useCallback(() => {
        setIsAnimating(true);
        setTimeout(() => {
            onClose();
            setIsAnimating(false);
        }, 350);
    }, [onClose]);

    const updateLoadingState = useCallback((key: keyof LoadingStates, value: boolean) => {
        setLoadingStates(prev => ({...prev, [key]: value}));
    }, []);

    const handleToggleLibrary = useCallback(async () => {
        if (!book) return;
        updateLoadingState('loadingLibrary', true);
        try {
            await toggleLibrary(book);
        } catch (error) {
            console.error("Error toggling library status:", error);
        } finally {
            updateLoadingState('loadingLibrary', false);
        }
    }, [book, toggleLibrary, updateLoadingState]);

    const handleToggleWishlist = useCallback(async () => {
        if (!book) return;
        updateLoadingState('loadingWishlist', true);
        try {
            await toggleWishlist(book);
        } catch (error) {
            console.error("Error toggling wishlist status:", error);
        } finally {
            updateLoadingState('loadingWishlist', false);
        }
    }, [book, toggleWishlist, updateLoadingState]);

    const handleToggleCurrentBook = useCallback(async () => {
        if (!book) return;
        updateLoadingState('loadingCurrentBook', true);
        try {
            await toggleCurrentBook(book);
        } catch (error) {
            console.error("Error setting current book:", error);
        } finally {
            updateLoadingState('loadingCurrentBook', false);
        }
    }, [book, toggleCurrentBook, updateLoadingState]);

    const handleLendBook = useCallback(async (borrowerId: string, message?: string) => {
        if (!book) return;
        updateLoadingState('loadingLending', true);
        try {
            await lendBook(book, borrowerId, message);
            setIsLendingModalOpened(false);
        } catch (error) {
            console.error("Error lending book:", error);
        } finally {
            updateLoadingState('loadingLending', false);
        }
    }, [book, lendBook, updateLoadingState]);

    const handleCancelLending = useCallback(async () => {
        if (!book) return;
        updateLoadingState('loadingLending', true);
        try {
            await cancelLending(book.key);
        } catch (error) {
            console.error("Error cancelling lending:", error);
        } finally {
            updateLoadingState('loadingLending', false);
        }
    }, [book, cancelLending, updateLoadingState]);

    const handlers = useMemo(() => ({
        handleToggleLibrary,
        handleToggleWishlist,
        handleToggleCurrentBook,
        handleCancelLending,
        setIsLendingModalOpened,
        setIsNotesModalOpened
    }), [
        handleToggleLibrary,
        handleToggleWishlist,
        handleToggleCurrentBook,
        handleCancelLending
    ]);

    if (!book && !isLoading) return null;

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
            }}
        >
            <Dialog open={isOpen || isAnimating} onOpenChange={(open) => !open && handleClose()}>
                <DialogContent className="max-h-[90vh] w-full overflow-y-auto sm:max-w-md md:max-w-lg lg:max-w-xl">
                    <DialogHeader className="space-y-2">
                        <DialogTitle className="break-words text-xl font-bold">
                            {book?.title || "Détails du livre"}
                        </DialogTitle>

                        {isLoading ? (
                            <>
                                <Skeleton className="mb-1 h-4 w-full"/>
                                <DialogDescription className="sr-only">
                                    Chargement...
                                </DialogDescription>
                            </>
                        ) : book?.description ? (
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
                        )}
                    </DialogHeader>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {/* Cover */}
                        {book && <BookCover book={book}/>}

                        {/* Book Information */}
                        {book && <BookInfo book={book} isLoading={isLoading}/>}
                    </div>

                    {/* Book Status */}
                    {book && <BookStatusDisplay bookStatus={bookStatus}/>}

                    {/* Lending Information */}
                    {(bookStatus.isBookLoanedInstance || bookStatus.isPendingLoanInstance) && (
                        <LendingInfoDisplay
                            lendingInfo={lendingInfo}
                            isPendingLoan={bookStatus.isPendingLoanInstance}
                        />
                    )}

                    {/* Actions */}
                    {book && (
                        <BookActions
                            book={book}
                            bookStatus={bookStatus}
                            notesCount={notesCount}
                            loadingStates={loadingStates}
                            handlers={handlers}
                        />
                    )}
                    {/* Notes Modal */}
                    {book && (
                        <BookNotesModal
                            book={book}
                            isOpen={isNotesModalOpened}
                            setIsOpen={setIsNotesModalOpened}
                            userId={userId}
                        />
                    )}

                    {/* Lending Modal */}
                    {book && (
                        <LendingModal
                            book={book}
                            isOpen={isLendingModalOpened}
                            onClose={() => setIsLendingModalOpened(false)}
                            onLend={handleLendBook}
                            isLoading={loadingStates.loadingLending}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}

export default BookModal;