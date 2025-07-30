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
                        variant: 'outline' as const,
                        className: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
                        icon: UserCheck
                    },
                    cardClassName: 'border-orange-200 bg-orange-50/30'
                };
            case 'pending_loan':
                return {
                    badge: {
                        text: 'Prêt en attente',
                        variant: 'outline' as const,
                        className: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
                        icon: Clock
                    },
                    cardClassName: 'border-yellow-200 bg-yellow-50/30'
                };
            case 'finished':
                return {
                    badge: {
                        text: 'Terminé',
                        variant: 'outline' as const,
                        className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
                        icon: CheckCircle
                    },
                    cardClassName: 'border-green-200 bg-green-50/30'
                };
            case 'current':
                return {
                    badge: {
                        text: 'En cours',
                        variant: 'outline' as const,
                        className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
                        icon: Clock
                    },
                    cardClassName: 'border-blue-200 bg-blue-50/30'
                };
            default:
                return {
                    badge: null,
                    cardClassName: ''
                };
        }
    }, [bookStatus]);

    return (
        <Card className={`group overflow-hidden transition-all hover:shadow-md ${statusConfig.cardClassName}`}>
            <CardHeader className="bg-primary/5 flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                <CardTitle className="line-clamp-1 text-lg font-medium">{userBook.Book.title}</CardTitle>
                <div className="flex items-center space-x-2">
                    {isBookFinished(userBook) && !isLoaned ?
                        !bookReview ?
                            (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 p-0 pt-0.5"
                                    onClick={handleReviewClick}
                                >
                                    <Star className="size-4 text-amber-500"/>
                                    <span className="sr-only">Donner un avis</span>
                                </Button>
                            ) : (
                                <div className="mr-2 flex items-center rounded-full bg-white px-2 py-1">
                                    <Star className="mr-1 inline-block size-3 text-amber-500"/>
                                    <span className="text-sm font-bold">{bookReview.rating}/5</span>
                                </div>
                            ) : null
                    }
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 p-0 pt-0.5"
                        onClick={() => openBookModal(userBook.Book as BookType)}
                    >
                        <Info className="size-4"/>
                        <span className="sr-only">Détails</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 p-4 pt-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <BookOpen className="text-muted-foreground mr-2 size-4"/>
                        <span className="text-muted-foreground text-sm">
              {userBook.Book.authors || "Auteur inconnu"}
            </span>
                    </div>

                    {/* Affichage du badge de statut */}
                    {statusConfig.badge && (
                        <div
                            className="flex flex-col items-end space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                            <Badge
                                variant={statusConfig.badge.variant}
                                className={`${statusConfig.badge.className} flex cursor-default items-center gap-1 transition-colors`}
                            >
                                <statusConfig.badge.icon className="size-3"/>
                                {statusConfig.badge.text}
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Informations supplémentaires pour les livres prêtés */}
                {isLoaned && lendingInfo && (
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm">
                        <div className="flex items-center gap-2 text-orange-700">
                            <UserCheck className="size-4"/>
                            <span
                                className="font-medium">Prêté à {lendingInfo.borrower.name || lendingInfo.borrower.username}</span>
                        </div>
                        {lendingInfo.acceptedAt && (
                            <p className="mt-1 text-orange-600">
                                Depuis le {new Date(lendingInfo.acceptedAt).toLocaleDateString('fr-FR')}
                            </p>
                        )}
                        {lendingInfo.dueDate && (
                            <p className="mt-1 text-orange-600">
                                À retourner le {new Date(lendingInfo.dueDate).toLocaleDateString('fr-FR')}
                            </p>
                        )}
                    </div>
                )}

                {(isLoaned || isPendingLoan) && lendingInfo && (
                    <div
                        className={`${isPendingLoan ? 'border-yellow-200 bg-yellow-50' : 'border-orange-200 bg-orange-50'} rounded-lg border p-3 text-sm`}>
                        <div
                            className={`flex items-center gap-2 ${isPendingLoan ? 'text-yellow-700' : 'text-orange-700'}`}>
                            <UserCheck className="size-4"/>
                            <span className="font-medium">
                    {isPendingLoan ? 'Demande de prêt en attente' : `Prêté à ${lendingInfo.borrower.name || lendingInfo.borrower.username}`}
                </span>
                        </div>
                        {lendingInfo.acceptedAt && (
                            <p className={`${isPendingLoan ? 'text-yellow-600' : 'text-orange-600'} mt-1`}>
                                Depuis le {new Date(lendingInfo.acceptedAt).toLocaleDateString('fr-FR')}
                            </p>
                        )}
                    </div>
                )}

                {/* Affichage du tracker de progression uniquement pour les livres en cours et non prêtés */}
                {userBook.isCurrentBook && !isLoaned && (
                    (userBook.Book.numberOfPages || !userBook.Book.numberOfPages && userBook.progressType === "percentage") ? (
                        <ProgressTracker
                            book={userBook.Book as BookType}
                            initialProgress={userBook.progress || 0}
                        />
                    ) : (
                        <NoPageNumber
                            bookId={userBook.Book.id}
                            bookKey={userBook.Book.key}
                        />
                    )
                )}
            </CardContent>
        </Card>
    );
};

export default LibraryCard;