import {Info, Star} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Book as BookType} from "@/types";
import {Review} from "@/components/Reviews/ReviewList";

type ReviewCardProps = {
    review: Review;
    openBookModal: (book: BookType) => void;
};

const ReviewCard = ({review, openBookModal}: ReviewCardProps) => {
    return (
        <Card key={review.id} className="overflow-hidden">
            <CardHeader className="bg-primary/5 flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                <CardTitle className="text-lg font-medium">{review.Book.title}</CardTitle>
                <div className="flex items-center">
                    <div className="mr-2 flex items-center rounded-full bg-white px-2 py-1">
                        <Star className="mr-1 inline-block size-3 text-amber-500"/>
                        <span className="text-sm font-bold">{review.rating}/5</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 p-0 pt-0.5"
                        onClick={() => openBookModal(review.Book as BookType)}
                    >
                        <Info className="size-4"/>
                        <span className="sr-only">Détails</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                {review.feedback ? (
                    <p className="text-muted-foreground">{review.feedback}</p>
                ) : (
                    <p className="text-muted-foreground italic">Pas de commentaire</p>
                )}
            </CardContent>
        </Card>
    );
};

export default ReviewCard;
