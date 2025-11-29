import {type Review} from "./ReviewList";
import ReviewsListLoading from "@/components/Reviews/ReviewsListLoading";
import ReviewCard from "@/components/Reviews/ReviewCard";
import {EmptyState, ErrorState} from "@/components/common";
import {Star, Users} from "lucide-react";

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
            <ErrorState
                title="Erreur lors du chargement"
                message={error}
                onRetry={() => window.location.reload()}
            />
        );
    }

    if (!reviews || reviews.length === 0) {
        const emptyConfig = tab === "public"
            ? {
                icon: Star,
                title: "Aucun avis public",
                message: "Il n'y a pas encore d'avis publics disponibles. Soyez le premier à partager votre opinion !"
            }
            : {
                icon: Users,
                title: "Aucun avis d'amis",
                message: "Vos amis n'ont pas encore partagé d'avis. Encouragez-les à donner leur opinion sur les livres qu'ils ont lus !"
            };

        return (
            <EmptyState
                icon={emptyConfig.icon}
                title={emptyConfig.title}
                message={emptyConfig.message}
            />
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review, index) => (
                <ReviewCard key={review.id} review={review} index={index}/>
            ))}
        </div>
    );
};

export default ReviewCards;
