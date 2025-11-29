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
                            className="border border-blue-200/60 bg-blue-50 text-blue-700 flex items-center gap-1.5 text-xs font-medium"
                        >
                            <BookIcon className="size-3"/>
                            Dans ma bibliothèque
                        </Badge>
                    )}
                    {inWishlist && (
                        <Badge
                            variant="secondary"
                            className="border border-rose-200/60 bg-rose-50 text-rose-700 flex items-center gap-1.5 text-xs font-medium"
                        >
                            <Heart className="size-3"/>
                            Dans ma wishlist
                        </Badge>
                    )}
                    {isBookLoanedInstance && (
                        <Badge
                            variant="secondary"
                            className="border border-orange-200/60 bg-orange-50 text-orange-700 flex items-center gap-1.5 text-xs font-medium"
                        >
                            <UserCheck className="size-3"/>
                            Prêté
                        </Badge>
                    )}
                    {isPendingLoanInstance && (
                        <Badge
                            variant="secondary"
                            className="border border-amber-200/60 bg-amber-50 text-amber-700 flex items-center gap-1.5 text-xs font-medium"
                        >
                            <Clock className="size-3"/>
                            Prêt en attente
                        </Badge>
                    )}
                    {!inLibrary && !inWishlist && (
                        <Badge
                            variant="secondary"
                            className="border border-slate-200/60 bg-slate-100 text-slate-600 text-xs font-medium"
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
                                className="border border-blue-200/60 bg-blue-50 text-blue-700 flex items-center gap-1.5 text-xs font-medium"
                            >
                                <BookMarked className="size-3"/>
                                En cours
                            </Badge>
                        ) : inLibrary ?
                            isBookFinishedInstance ? (
                                <Badge
                                    variant="secondary"
                                    className="border border-emerald-200/60 bg-emerald-50 text-emerald-700 flex items-center gap-1.5 text-xs font-medium"
                                >
                                    <BookCopy className="size-3"/>
                                    Terminé
                                </Badge>
                            ) : (
                                <Badge
                                    variant="secondary"
                                    className="border border-slate-200/60 bg-slate-100 text-slate-600 flex items-center gap-1.5 text-xs font-medium"
                                >
                                    <BookCopy className="size-3"/>
                                    Non commencé
                                </Badge>
                            ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};
