import {Button} from "@/components/ui/button";
import {
    Heart,
    Trash2,
    BookMarked,
    BookCopy,
    Users,
    UserCheck,
    Book as BookIcon,
    FileText,
    Loader2
} from "lucide-react";
import {BookActionsProps} from "@/types/bookModal";

export const BookActions = ({
                                book,
                                bookStatus,
                                loadingStates,
                                handlers,
                                notesCount
                            }: BookActionsProps) => {
    const {
        inLibrary,
        inWishlist,
        isCurrentBookInstance,
        isBookFinishedInstance,
        isBookLoanedInstance,
        isPendingLoanInstance
    } = bookStatus;

    const {
        loadingLibrary,
        loadingWishlist,
        loadingCurrentBook,
        loadingLending
    } = loadingStates;

    const {
        handleToggleLibrary,
        handleToggleWishlist,
        handleToggleCurrentBook,
        handleCancelLending,
        setIsLendingModalOpened,
        setIsNotesModalOpened
    } = handlers;

    const isAnyLoading = loadingLibrary || loadingWishlist || loadingCurrentBook || loadingLending;

    return (
        <div className="mt-4 flex flex-col flex-wrap gap-2 sm:flex-row sm:justify-start">
            {/* Marquer comme en lecture */}
            {(inLibrary && !isCurrentBookInstance && !isBookFinishedInstance && !isBookLoanedInstance && !isPendingLoanInstance) && (
                <Button
                    variant="outline"
                    className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-200 sm:w-auto"
                    onClick={handleToggleCurrentBook}
                    disabled={isAnyLoading}
                >
                    {loadingCurrentBook ? (
                        <Loader2 className="mr-2 size-4 animate-spin"/>
                    ) : (
                        <BookMarked className="mr-2 size-4"/>
                    )}
                    Marquer comme en lecture
                </Button>
            )}

            {/* Marquer comme non commencé */}
            {(inLibrary && isCurrentBookInstance && !isBookLoanedInstance && !isPendingLoanInstance) && (
                <Button
                    variant="outline"
                    className="w-full border-gray-300 hover:bg-gray-200 sm:w-auto"
                    onClick={handleToggleCurrentBook}
                    disabled={isAnyLoading}
                >
                    {loadingCurrentBook ? (
                        <Loader2 className="mr-2 size-4 animate-spin"/>
                    ) : (
                        <BookCopy className="mr-2 size-4"/>
                    )}
                    Marquer comme non commencé
                </Button>
            )}

            {/* Prêter le livre */}
            {(inLibrary && !isBookLoanedInstance && !isPendingLoanInstance) && (
                <Button
                    variant="info"
                    className="w-full sm:w-auto"
                    onClick={() => setIsLendingModalOpened(true)}
                    disabled={isAnyLoading}
                >
                    {loadingLending ? (
                        <Loader2 className="mr-2 size-4 animate-spin"/>
                    ) : (
                        <Users className="mr-2 size-4"/>
                    )}
                    Prêter ce livre
                </Button>
            )}

            {/* Marquer comme rendu / Annuler demande */}
            {(inLibrary && (isBookLoanedInstance || isPendingLoanInstance)) && (
                <Button
                    variant="outline"
                    className="w-full border-orange-300 text-orange-700 hover:bg-orange-200 sm:w-auto"
                    onClick={() => handleCancelLending(book)}
                    disabled={isAnyLoading}
                >
                    {loadingLending ? (
                        <Loader2 className="mr-2 size-4 animate-spin"/>
                    ) : (
                        <UserCheck className="mr-2 size-4"/>
                    )}
                    {isPendingLoanInstance ? 'Annuler la demande' : 'Marquer comme rendu'}
                </Button>
            )}

            {/* Retirer de la bibliothèque */}
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

            {/* Retirer de la wishlist */}
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

            {/* Ajouter à la bibliothèque/wishlist */}
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

            {/* Voir les notes */}
            <Button
                onClick={() => setIsNotesModalOpened(true)}
                variant="notes"
            >
                <FileText className="mr-2 size-4"/>
                Voir les notes
                <span className="text-xs text-gray-500">
                    ({notesCount || 0})
                </span>
            </Button>
        </div>
    );
};