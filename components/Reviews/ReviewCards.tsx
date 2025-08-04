import {type Review} from "./ReviewList";
import ReviewsListLoading from "@/components/Reviews/ReviewsListLoading";
import {Star} from "lucide-react";
import ReviewCard from "@/components/Reviews/ReviewCard";

const ReviewCards = (
    {
        tab,
        reviews,
        isLoading,
        error
    }: {
        tab: "public" | "friends",
        reviews?: Review[],
        isLoading: boolean,
        error: string | null
    }) => {
    if (isLoading) {
        return <ReviewsListLoading/>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <Star className="text-destructive size-12"/>
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
                <Star className="text-muted-foreground size-12"/>
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