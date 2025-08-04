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

    return (
        <Card
            className={cn('group overflow-hidden transition-all duration-200 hover:shadow-lg border-border/50', statusConfig.cardClassName)}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                    <CardTitle className="line-clamp-2 text-lg font-medium leading-tight">
                        {userBook.Book.title}
                    </CardTitle>
                    <div className="flex shrink-0 items-center gap-1">
                        {isBookFinished(userBook) && !isLoaned && (
                            !bookReview ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="size-8 p-0 hover:bg-amber-50"
                                    onClick={handleReviewClick}
                                >
                                    <Star className="size-4 text-amber-500"/>
                                    <span className="sr-only">Donner un avis</span>
                                </Button>
                            ) : (
                                <div
                                    className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-amber-700">
                                    <Star className="size-3 fill-current"/>
                                    <span className="text-xs font-medium">{bookReview.rating}/5</span>
                                </div>
                            )
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-muted size-8 p-0"
                            onClick={() => openBookModal(userBook.Book as BookType)}
                        >
                            <Info className="text-muted-foreground size-4"/>
                            <span className="sr-only">Détails</span>
                        </Button>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <BookOpen className="size-4"/>
                        <span className="line-clamp-1">
                            {userBook.Book.authors || "Auteur inconnu"}
                        </span>
                    </div>

                    {statusConfig.badge && (
                        <Badge
                            variant={statusConfig.badge.variant}
                            className={cn('flex items-center gap-1.5 text-xs transition-colors', statusConfig.badge.className)}
                        >
                            <statusConfig.badge.icon className="size-3"/>
                            {statusConfig.badge.text}
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
                {/* Information de prêt simplifiée */}
                {(isLoaned || isPendingLoan) && lendingInfo && (
                    <div className={`
                        rounded-lg border-l-4 py-2 pl-4
                        ${isPendingLoan
                        ? 'border-l-yellow-200 bg-yellow-50/30'
                        : 'border-l-orange-200 bg-orange-50/30'
                    }
                    `}>
                        <div className={`
                            mb-1 text-sm font-medium
                            ${isPendingLoan ? 'text-yellow-800' : 'text-orange-800'}
                        `}>
                            {isPendingLoan
                                ? 'Demande de prêt en attente'
                                : `Prêté à ${lendingInfo.borrower.name || lendingInfo.borrower.username}`
                            }
                        </div>
                        {lendingInfo.acceptedAt && (
                            <div className={`
                                text-xs
                                ${isPendingLoan ? 'text-yellow-600' : 'text-orange-600'}
                            `}>
                                Depuis le {new Date(lendingInfo.acceptedAt).toLocaleDateString('fr-FR')}
                            </div>
                        )}
                        {lendingInfo.dueDate && (
                            <div className="text-xs text-orange-600">
                                Retour prévu le {new Date(lendingInfo.dueDate).toLocaleDateString('fr-FR')}
                            </div>
                        )}
                    </div>
                )}

                {/* Tracker de progression */}
                {userBook.isCurrentBook && !isLoaned && (
                    <div className="pt-2">
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