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
import {UserBook} from "@prisma/client";

type LibraryCardProps = {
    userBook: UserBook;
    openBookModal: (book: BookType) => void;
};

const LibraryCard = ({userBook, openBookModal}: LibraryCardProps) => {
    const {setBookToReview} = useReviewModalStore();
    const {user} = useUser();
    const {isBookLoaned} = useBooks();

    const isBookFinished = useCallback((userBook: UserBook) => {
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

    const lendingInfo = useMemo(() => {
        if (!user?.lentBooks || !isLoaned) return null;

        return user.lentBooks.find(
            lending => lending.book.key === userBook.Book.key &&
                lending.status === 'ACCEPTED' &&
                !lending.returnedAt
        );
    }, [user?.lentBooks, isLoaned, userBook.Book.key]);

    const handleReviewClick = () => {
        setBookToReview(userBook.Book as MoreInfoBook);
    };

    // Déterminer le statut du livre pour l'affichage
    const bookStatus = useMemo(() => {
        if (isLoaned) return 'loaned';
        if (isBookFinished(userBook)) return 'finished';
        if (userBook.isCurrentBook) return 'current';
        return 'in_library';
    }, [isLoaned, isBookFinished, userBook]);

    // Configuration des badges selon le statut
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
        <Card className={`overflow-hidden transition-all hover:shadow-md group ${statusConfig.cardClassName}`}>
            <CardHeader className="p-4 pb-2 bg-primary/5 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg font-medium line-clamp-1">{userBook.Book.title}</CardTitle>
                <div className="flex items-center space-x-2">
                    {isBookFinished(userBook) && !isLoaned ?
                        !bookReview ?
                            (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 p-0 pt-0.5"
                                    onClick={handleReviewClick}
                                >
                                    <Star className="h-4 w-4 text-amber-500"/>
                                    <span className="sr-only">Donner un avis</span>
                                </Button>
                            ) : (
                                <div className="flex items-center bg-white px-2 py-1 rounded-full mr-2">
                                    <Star className="h-3 w-3 text-amber-500 mr-1 inline-block"/>
                                    <span className="text-sm font-bold">{bookReview.rating}/5</span>
                                </div>
                            ) : null
                    }
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 pt-0.5"
                        onClick={() => openBookModal(userBook.Book as BookType)}
                    >
                        <Info className="h-4 w-4"/>
                        <span className="sr-only">Détails</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-3 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-muted-foreground"/>
                        <span className="text-sm text-muted-foreground">
              {userBook.Book.authors || "Auteur inconnu"}
            </span>
                    </div>

                    {/* Affichage du badge de statut */}
                    {statusConfig.badge && (
                        <div
                            className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 items-end sm:items-center">
                            <Badge
                                variant={statusConfig.badge.variant}
                                className={`${statusConfig.badge.className} cursor-default transition-colors flex items-center gap-1`}
                            >
                                <statusConfig.badge.icon className="h-3 w-3"/>
                                {statusConfig.badge.text}
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Informations supplémentaires pour les livres prêtés */}
                {isLoaned && lendingInfo && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm">
                        <div className="flex items-center gap-2 text-orange-700">
                            <UserCheck className="h-4 w-4"/>
                            <span
                                className="font-medium">Prêté à {lendingInfo.borrower.name || lendingInfo.borrower.username}</span>
                        </div>
                        {lendingInfo.acceptedAt && (
                            <p className="text-orange-600 mt-1">
                                Depuis le {new Date(lendingInfo.acceptedAt).toLocaleDateString('fr-FR')}
                            </p>
                        )}
                        {lendingInfo.dueDate && (
                            <p className="text-orange-600 mt-1">
                                À retourner le {new Date(lendingInfo.dueDate).toLocaleDateString('fr-FR')}
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