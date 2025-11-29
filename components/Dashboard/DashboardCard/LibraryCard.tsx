import {BookOpen, Info, Star, UserCheck, Clock, CheckCircle} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import ProgressTracker from "@/components/Dashboard/Progress/ProgressTracker";
import NoPageNumber from "@/components/Dashboard/Progress/NoPageNumber";
import {Book as BookType, MoreInfoBook} from "@/types";
import {useReviewModalStore} from "@/store/reviewModalStore";
import {useUser} from "@/hooks/useUser";
import {useBooks} from "@/hooks/useBooks";
import {useCallback, useMemo} from "react";
import {cn} from "@/lib/utils";
import Image from "next/image";
import {BookCoverPlaceholder} from "@/components/common/BookCoverPlaceholder";

type LibraryCardProps = {
    userBook: {
        Book: BookType;
        progress: number;
        progressType: "percentage" | "numberOfPages";
        isCurrentBook: boolean;
    };
    openBookModal: (book: BookType) => void;
};

const LibraryCard = ({userBook, openBookModal}: LibraryCardProps) => {
    const {setBookToReview} = useReviewModalStore();
    const {user} = useUser();
    const {isBookLoaned, isBookPendingLoan} = useBooks();

    const isBookFinished = useCallback((userBook: {
        Book: BookType;
        progress: number;
        progressType: "percentage" | "numberOfPages";
        isCurrentBook: boolean;
    }) => {
        return (
            (userBook.progressType === "percentage" && userBook.progress === 100) ||
            (userBook.progressType === "numberOfPages" &&
                userBook.progress === userBook.Book.numberOfPages
            )
        );
    }, []);

    const bookReview = useMemo(() => {
        return user?.BookReview.find((review) => review.bookId === userBook.Book.id);
    }, [user, userBook.Book.id]);

    const isLoaned = useMemo(() => {
        return isBookLoaned(userBook.Book.key);
    }, [isBookLoaned, userBook.Book.key]);

    const isPendingLoan = useMemo(() => {
        return isBookPendingLoan(userBook.Book.key);
    }, [isBookPendingLoan, userBook.Book.key]);

    const lendingInfo = useMemo(() => {
        if (!user?.lentBooks || (!isLoaned && !isPendingLoan)) return null;

        return user.lentBooks.find(
            lending => lending.book.key === userBook.Book.key &&
                (lending.status === 'ACCEPTED' || lending.status === 'PENDING') &&
                !lending.returnedAt
        );
    }, [user?.lentBooks, isLoaned, isPendingLoan, userBook.Book.key]);

    const handleReviewClick = () => {
        setBookToReview(userBook.Book as MoreInfoBook);
    };

    const bookStatus = useMemo(() => {
        if (isLoaned) return 'loaned';
        if (isPendingLoan) return 'pending_loan';
        if (isBookFinished(userBook)) return 'finished';
        if (userBook.isCurrentBook) return 'current';
        return 'in_library';
    }, [isLoaned, isPendingLoan, isBookFinished, userBook]);

    const statusConfig = useMemo(() => {
        switch (bookStatus) {
            case 'loaned':
                return {
                    badge: {
                        text: 'Prêté',
                        variant: 'secondary' as const,
                        className: 'text-orange-700 bg-orange-50 border border-orange-200/60 hover:bg-orange-100',
                        icon: UserCheck,
                        indicatorColor: 'bg-orange-500'
                    }
                };
            case 'pending_loan':
                return {
                    badge: {
                        text: 'Prêt en attente',
                        variant: 'secondary' as const,
                        className: 'text-amber-700 bg-amber-50 border border-amber-200/60 hover:bg-amber-100',
                        icon: Clock,
                        indicatorColor: 'bg-amber-500'
                    }
                };
            case 'finished':
                return {
                    badge: {
                        text: 'Terminé',
                        variant: 'secondary' as const,
                        className: 'text-emerald-700 bg-emerald-50 border border-emerald-200/60 hover:bg-emerald-100',
                        icon: CheckCircle,
                        indicatorColor: 'bg-emerald-500'
                    }
                };
            case 'current':
                return {
                    badge: {
                        text: 'En cours',
                        variant: 'secondary' as const,
                        className: 'text-blue-700 bg-blue-50 border border-blue-200/60 hover:bg-blue-100',
                        icon: Clock,
                        indicatorColor: 'bg-blue-500'
                    }
                };
            default:
                return {
                    badge: null
                };
        }
    }, [bookStatus]);

    const bookCoverUrl = userBook.Book.cover
        ? userBook.Book.cover
        : userBook.Book.cover_i
            ? `https://covers.openlibrary.org/b/id/${userBook.Book.cover_i}-M.jpg`
            : null;

    return (
        <Card
            className={cn(
                'group relative overflow-hidden transition-all duration-200 hover:shadow-md border border-slate-200 bg-white h-full flex flex-col',
                'hover:border-slate-300 hover:-translate-y-0.5'
            )}
        >
            {/* Book Cover with more natural styling */}
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100">
                {bookCoverUrl ? (
                    <>
                        <Image
                            src={bookCoverUrl}
                            alt={userBook.Book.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        {/* Subtle vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                    </>
                ) : (
                    <BookCoverPlaceholder
                        title={userBook.Book.title}
                        authors={userBook.Book.authors}
                        variant="default"
                    />
                )}

                {/* Status indicator - corner badge */}
                {statusConfig.badge && (
                    <div className={cn(
                        "absolute top-2 left-2 rounded-full px-2 py-1 shadow-sm backdrop-blur-sm",
                        "flex items-center gap-1.5 text-[10px] font-medium",
                        statusConfig.badge.className
                    )}>
                        <statusConfig.badge.icon className="size-2.5" />
                        <span>{statusConfig.badge.text}</span>
                    </div>
                )}

                {/* Action buttons - more subtle */}
                <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {isBookFinished(userBook) && !isLoaned && (
                        !bookReview ? (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="h-7 w-7 bg-white/95 backdrop-blur-sm p-0 shadow-sm hover:bg-white border border-slate-200/50"
                                onClick={handleReviewClick}
                            >
                                <Star className="size-3.5 text-amber-500"/>
                                <span className="sr-only">Donner un avis</span>
                            </Button>
                        ) : (
                            <div className="flex items-center gap-1 rounded-md bg-white/95 backdrop-blur-sm px-2 py-1 shadow-sm border border-slate-200/50">
                                <Star className="size-3 fill-amber-500 text-amber-500"/>
                                <span className="text-xs font-semibold text-slate-700">{bookReview.rating}</span>
                            </div>
                        )
                    )}
                    <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 w-7 bg-white/95 backdrop-blur-sm p-0 shadow-sm hover:bg-white border border-slate-200/50"
                        onClick={() => openBookModal(userBook.Book as BookType)}
                    >
                        <Info className="size-3.5 text-slate-600"/>
                        <span className="sr-only">Détails</span>
                    </Button>
                </div>
            </div>

            <CardHeader className="pb-2.5 pt-3.5 px-4">
                <div className="space-y-2">
                    <CardTitle className="line-clamp-2 text-base font-semibold leading-tight text-slate-900 group-hover:text-slate-700 transition-colors">
                        {userBook.Book.title}
                    </CardTitle>

                    <div className="flex items-start gap-1.5 text-xs text-slate-500">
                        <BookOpen className="size-3 mt-0.5 shrink-0"/>
                        <span className="line-clamp-1">
                            {Array.isArray(userBook.Book.authors)
                                ? userBook.Book.authors.join(", ")
                                : userBook.Book.authors || "Auteur inconnu"}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-2.5 pt-0 pb-4 px-4">
                {/* Information de prêt - more compact */}
                {(isLoaned || isPendingLoan) && lendingInfo && (
                    <div className={cn(
                        "rounded border-l-2 py-2 px-3 text-xs",
                        isPendingLoan
                            ? 'border-l-yellow-400 bg-yellow-50/50'
                            : 'border-l-orange-400 bg-orange-50/50'
                    )}>
                        <div className={cn(
                            "flex items-center gap-1.5 font-medium mb-0.5",
                            isPendingLoan ? 'text-yellow-700' : 'text-orange-700'
                        )}>
                            <UserCheck className="size-3" />
                            {isPendingLoan
                                ? 'Prêt en attente'
                                : `Prêté à ${lendingInfo.borrower.name || lendingInfo.borrower.username}`
                            }
                        </div>
                        {lendingInfo.acceptedAt && (
                            <div className="text-[10px] text-slate-600">
                                Depuis {new Date(lendingInfo.acceptedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                            </div>
                        )}
                    </div>
                )}

                {/* Tracker de progression */}
                {userBook.isCurrentBook && !isLoaned && (
                    <div>
                        {(userBook.Book.numberOfPages || (!userBook.Book.numberOfPages && userBook.progressType === "percentage")) ? (
                            <ProgressTracker
                                book={userBook.Book as BookType}
                                initialProgress={userBook.progress || 0}
                            />
                        ) : (
                            <NoPageNumber
                                bookId={userBook.Book.id}
                                bookKey={userBook.Book.key}
                            />
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default LibraryCard;
