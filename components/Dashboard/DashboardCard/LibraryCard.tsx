import {BookOpen, Info, Star} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import ProgressTracker from "@/components/Dashboard/Progress/ProgressTracker";
import NoPageNumber from "@/components/Dashboard/Progress/NoPageNumber";
import {Book as BookType, MoreInfoBook} from "@/types";
import {useReviewModalStore} from "@/store/reviewModalStore";
import {useUser} from "@/hooks/useUser";
import {useCallback, useMemo} from "react";

type LibraryCardProps = {
    userBook: any;
    openBookModal: (book: BookType) => void;
};

const LibraryCard = ({userBook, openBookModal}: LibraryCardProps) => {
    const {setBookToReview} = useReviewModalStore();
    const {user} = useUser();

    const isBookFinished = useCallback((userBook: any) => {
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

    const handleReviewClick = () => {
        setBookToReview(userBook.Book as MoreInfoBook);
    };

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md group">
            <CardHeader className="p-4 pb-2 bg-primary/5 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg font-medium line-clamp-1">{userBook.Book.title}</CardTitle>
                <div className="flex items-center space-x-2">
                    {isBookFinished(userBook) ?
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
                    {isBookFinished(userBook) && (
                        <div
                            className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 items-end sm:items-center">
                            <Badge
                                variant="outline"
                                className="bg-secondary/10 text-secondary cursor-default hover:bg-secondary/20 transition-colors"
                            >
                                Livre fini
                            </Badge>
                        </div>
                    )}
                </div>

                {userBook.isCurrentBook && (
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
