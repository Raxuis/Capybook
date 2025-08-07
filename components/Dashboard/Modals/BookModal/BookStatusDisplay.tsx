import {Badge} from "@/components/ui/badge";
import {
    Book as BookIcon,
    Heart,
    BookMarked,
    BookCopy,
    UserCheck,
    Clock
} from "lucide-react";
import {BookStatusDisplayProps} from "@/types/bookModal";

export const BookStatusDisplay = ({bookStatus}: BookStatusDisplayProps) => {
    const {
        inLibrary,
        inWishlist,
        isCurrentBookInstance,
        isBookFinishedInstance,
        isBookLoanedInstance,
        isPendingLoanInstance
    } = bookStatus;

    return (
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
                {(!inWishlist && inLibrary) && (
                    <h3 className="text-sm font-medium text-gray-500">Statut de lecture</h3>
                )}
                <div className="flex flex-wrap gap-2">
                    {isCurrentBookInstance ? (
                        <Badge variant="outline"
                               className="flex items-center gap-1 bg-indigo-100 text-indigo-600">
                            <BookMarked className="size-3"/>
                            En cours de lecture
                        </Badge>
                    ) : inLibrary ?
                        isBookFinishedInstance ? (
                            <Badge variant="outline"
                                   className="flex items-center gap-1 bg-green-100 text-green-600">
                                <BookCopy className="size-3"/>
                                Terminé
                            </Badge>
                        ) : (
                            <Badge variant="outline"
                                   className="flex items-center gap-1 text-gray-500">
                                <BookCopy className="size-3"/>
                                Non commencé
                            </Badge>
                        ) : null}
                </div>
            </div>
        </div>
    );
};