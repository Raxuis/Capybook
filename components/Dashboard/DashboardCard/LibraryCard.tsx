import {BookOpen, Info, Star, UserCheck, Clock, CheckCircle} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import ProgressTracker from "@/components/Dashboard/Progress/ProgressTracker";
import NoPageNumber from "@/components/Dashboard/Progress/NoPageNumber";
import {Book as BookType, MoreInfoBook} from "@/types";
import {useReviewModalStore} from "@/store/reviewModalStore";
import {useUser} from "@/hooks/useUser";
import {useBooks} from "@/hooks/useBooks";
import {useCallback, useMemo} from "react";
import {cn} from "@/lib/utils";
import Image from "next/image";

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
                        className: 'text-orange-700 bg-orange-50/80 border-0 hover:text-orange-800 hover:bg-orange-100',
                        icon: UserCheck
                    },
                    cardClassName: 'border-l-4 border-l-orange-200'
                };
            case 'pending_loan':
                return {
                    badge: {
                        text: 'Prêt en attente',
                        variant: 'secondary' as const,
                        className: 'text-yellow-700 bg-yellow-50/80 border-0 hover:text-yellow-800 hover:bg-yellow-100',
                        icon: Clock
                    },
                    cardClassName: 'border-l-4 border-l-yellow-200'
                };
            case 'finished':
                return {
                    badge: {
                        text: 'Terminé',
                        variant: 'secondary' as const,
                        className: 'text-green-700 bg-green-50/80 border-0 hover:text-green-800 hover:bg-green-100',
                        icon: CheckCircle
                    },
                    cardClassName: 'border-l-4 border-l-green-200'
                };
            case 'current':
                return {
                    badge: {
                        text: 'En cours',
                        variant: 'secondary' as const,
                        className: 'text-blue-700 bg-blue-50/80 border-0 hover:text-blue-800 hover:bg-blue-100',
                        icon: Clock
                    },
                    cardClassName: 'border-l-4 border-l-blue-200'
                };
            default:
                return {
                    badge: null,
                    cardClassName: ''
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
                'group relative overflow-hidden transition-all duration-300 hover:shadow-xl border-border/60 bg-gradient-to-br from-card to-card/95 h-full flex flex-col',
                statusConfig.cardClassName
            )}
        >
            {/* Book Cover Section */}
            <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                {bookCoverUrl ? (
                    <Image
                        src={bookCoverUrl}
                        alt={userBook.Book.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <BookOpen className="size-16 text-slate-300" />
                    </div>
                )}
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                {/* Action buttons overlay */}
                <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    {isBookFinished(userBook) && !isLoaned && (
                        !bookReview ? (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="size-8 bg-white/90 backdrop-blur-sm p-0 shadow-md hover:bg-white hover:scale-110 transition-transform"
                                onClick={handleReviewClick}
                            >
                                <Star className="size-4 text-amber-500"/>
                                <span className="sr-only">Donner un avis</span>
                            </Button>
                        ) : (
                            <div className="flex items-center gap-1 rounded-md bg-white/90 backdrop-blur-sm px-2.5 py-1.5 shadow-md">
                                <Star className="size-3.5 fill-amber-500 text-amber-500"/>
                                <span className="text-xs font-semibold text-slate-700">{bookReview.rating}/5</span>
                            </div>
                        )
                    )}
                    <Button
                        variant="secondary"
                        size="sm"
                        className="size-8 bg-white/90 backdrop-blur-sm p-0 shadow-md hover:bg-white hover:scale-110 transition-transform"
                        onClick={() => openBookModal(userBook.Book as BookType)}
                    >
                        <Info className="size-4 text-slate-700"/>
                        <span className="sr-only">Détails</span>
                    </Button>
                </div>
            </div>

            <CardHeader className="pb-3 pt-4">
                <div className="space-y-2.5">
                    <CardTitle className="line-clamp-2 text-lg font-semibold leading-snug text-slate-900 group-hover:text-primary transition-colors">
                        {userBook.Book.title}
                    </CardTitle>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <BookOpen className="size-3.5 shrink-0"/>
                        <span className="line-clamp-1 font-medium">
                            {Array.isArray(userBook.Book.authors)
                                ? userBook.Book.authors.join(", ")
                                : userBook.Book.authors || "Auteur inconnu"}
                        </span>
                    </div>

                    {statusConfig.badge && (
                        <div className="pt-1">
                            <Badge
                                variant={statusConfig.badge.variant}
                                className={cn(
                                    'inline-flex items-center gap-1.5 text-xs font-medium transition-colors shadow-sm',
                                    statusConfig.badge.className
                                )}
                            >
                                <statusConfig.badge.icon className="size-3"/>
                                {statusConfig.badge.text}
                            </Badge>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-0 pb-4">
                {/* Information de prêt simplifiée */}
                {(isLoaned || isPendingLoan) && lendingInfo && (
                    <div className={cn(
                        "rounded-lg border-l-4 py-2.5 pl-4 pr-3 shadow-sm",
                        isPendingLoan
                            ? 'border-l-yellow-300 bg-gradient-to-r from-yellow-50/80 to-yellow-50/40'
                            : 'border-l-orange-300 bg-gradient-to-r from-orange-50/80 to-orange-50/40'
                    )}>
                        <div className={cn(
                            "mb-1 flex items-center gap-1.5 text-sm font-semibold",
                            isPendingLoan ? 'text-yellow-800' : 'text-orange-800'
                        )}>
                            <UserCheck className="size-3.5" />
                            {isPendingLoan
                                ? 'Demande de prêt en attente'
                                : `Prêté à ${lendingInfo.borrower.name || lendingInfo.borrower.username}`
                            }
                        </div>
                        {lendingInfo.acceptedAt && (
                            <div className={cn(
                                "text-xs font-medium",
                                isPendingLoan ? 'text-yellow-700/80' : 'text-orange-700/80'
                            )}>
                                Depuis le {new Date(lendingInfo.acceptedAt).toLocaleDateString('fr-FR')}
                            </div>
                        )}
                        {lendingInfo.dueDate && (
                            <div className="text-xs font-medium text-orange-700/80">
                                Retour prévu le {new Date(lendingInfo.dueDate).toLocaleDateString('fr-FR')}
                            </div>
                        )}
                    </div>
                )}

                {/* Tracker de progression */}
                {userBook.isCurrentBook && !isLoaned && (
                    <div className="pt-1">
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
