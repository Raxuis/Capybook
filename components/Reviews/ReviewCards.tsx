import {type Review} from "./ReviewList";
import ReviewsListLoading from "@/components/Reviews/ReviewsListLoading";
import {Star} from "lucide-react";
import ReviewCard from "@/components/Reviews/ReviewCard";

const ReviewCards = ({reviews, isLoading, error}: { reviews?: Review[], isLoading: boolean, error: boolean }) => {
    if (isLoading) {
        return <ReviewsListLoading/>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <Star className="h-12 w-12 text-destructive"/>
                <p className="text-destructive">{error}</p>
            </div>
        );
    }

    if (!reviews || reviews.length === 0) {
        const emptyMessage = tab === "public"
            ? "Aucun avis public pour le moment"
            : "Aucun avis d'amis pour le moment";

        return (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <Star className="h-12 w-12 text-muted-foreground"/>
                <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
        );
    }
    return (
        <div className="grid gap-4">
            {reviews.map((review, index) => (
                <ReviewCard key={review.id} review={review} index={index}/>
            ))}
        </div>
    );
};

export default ReviewCards;