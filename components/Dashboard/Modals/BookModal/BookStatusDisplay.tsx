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
        <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">Statut</h3>
                <div className="flex flex-wrap gap-2">
                    {inLibrary && (
                        <Badge
                            variant="secondary"
                            className="flex items-center gap-1.5 border border-blue-200/60 bg-blue-50 text-xs font-medium text-blue-700 hover:bg-blue-100"
                        >
                            <BookIcon className="size-3"/>
                            Dans ma bibliothèque
                        </Badge>
                    )}
                    {inWishlist && (
                        <Badge
                            variant="secondary"
                            className="flex items-center gap-1.5 border border-pink-200/60 bg-pink-50 text-xs font-medium text-pink-700 hover:bg-pink-100"
                        >
                            <Heart className="size-3"/>
                            Dans ma wishlist
                        </Badge>
                    )}
                    {isBookLoanedInstance && (
                        <Badge
                            variant="secondary"
                            className="flex items-center gap-1.5 border border-orange-200/60 bg-orange-50 text-xs font-medium text-orange-700 hover:bg-orange-100"
                        >
                            <UserCheck className="size-3"/>
                            Prêté
                        </Badge>
                    )}
                    {isPendingLoanInstance && (
                        <Badge
                            variant="secondary"
                            className="flex items-center gap-1.5 border border-amber-200/60 bg-amber-50 text-xs font-medium text-amber-700 hover:bg-amber-100"
                        >
                            <Clock className="size-3"/>
                            Prêt en attente
                        </Badge>
                    )}
                    {!inLibrary && !inWishlist && (
                        <Badge
                            variant="secondary"
                            className="border border-slate-200/60 bg-slate-100 text-xs font-medium text-slate-600 hover:bg-slate-200"
                        >
                            Non ajouté
                        </Badge>
                    )}
                </div>
            </div>

            {(!inWishlist && inLibrary) && (
                <div className="space-y-3 border-t border-slate-200/60 pt-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">Lecture</h3>
                    <div className="flex flex-wrap gap-2">
                        {isCurrentBookInstance ? (
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1.5 border border-blue-200/60 bg-blue-50 text-xs font-medium text-blue-700"
                            >
                                <BookMarked className="size-3"/>
                                En cours
                            </Badge>
                        ) : isBookFinishedInstance ? (
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1.5 border border-emerald-200/60 bg-emerald-50 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                            >
                                <BookCopy className="size-3"/>
                                Terminé
                            </Badge>
                        ) : (
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1.5 border border-slate-200/60 bg-slate-100 text-xs font-medium text-slate-600 hover:bg-slate-200"
                            >
                                <BookCopy className="size-3"/>
                                Non commencé
                            </Badge>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
