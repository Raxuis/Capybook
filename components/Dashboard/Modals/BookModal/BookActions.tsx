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
        <div className="mt-6 flex flex-col flex-wrap gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-start">
            {/* Marquer comme en lecture */}
            {(inLibrary && !isCurrentBookInstance && !isBookFinishedInstance && !isBookLoanedInstance && !isPendingLoanInstance) && (
                <Button
                    variant="outline"
                    className="w-full border-blue-200/60 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100 sm:w-auto"
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
                    className="w-full border-slate-200/60 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100 sm:w-auto"
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
                    variant="outline"
                    className="w-full border-slate-200/60 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 sm:w-auto"
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
                    className="w-full border-orange-200/60 bg-orange-50 text-orange-700 hover:border-orange-300 hover:bg-orange-100 hover:text-orange-800 sm:w-auto"
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
                        className="w-full border-blue-200/60 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100 sm:w-auto"
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
                        className="w-full border-rose-200/60 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100 sm:w-auto"
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
                className="w-full sm:w-auto"
            >
                <FileText className="mr-2 size-4"/>
                Voir les notes
                {notesCount > 0 && (
                    <span className="ml-1.5 rounded-full bg-slate-200 px-1.5 py-0.5 text-xs font-medium text-slate-700">
                        {notesCount}
                    </span>
                )}
            </Button>
        </div>
    );
};
