"use client";

import {useEffect, useState} from "react";
import {getReviews} from "@/actions/reviews";
import ReviewCard from "@/components/Reviews/ReviewCard";
import {Pagination} from "@/components/Reviews/Pagination";
import {Star} from "lucide-react";
import ReviewsListLoading from "./ReviewsListLoading";

type ReviewListProps = {
    page?: string;
};

type Review = {
    id: string;
    rating: number;
    feedback: string | null;
    createdAt: string;
    User: {
        username: string;
        image: string | null;
        favoriteColor: string | null;
    };
    Book: {
        title: string;
        cover: string | null;
    };
};

type ReviewsData = {
    reviews: Review[];
    total: number;
    totalPages: number;
    currentPage: number;
};

export default function ReviewList({page = "1"}: ReviewListProps) {
    const [data, setData] = useState<ReviewsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setIsLoading(true);
                const currentPage = parseInt(page);
                const reviewsData = await getReviews(currentPage);
                // Convert null ratings to 0 to match the Review type definition
                const reviewsWithNonNullRatings = reviewsData.reviews.map(review => ({
                    ...review,
                    rating: review.rating ?? 0,
                    createdAt: review.createdAt.toString()
                }));
                setData({...reviewsData, reviews: reviewsWithNonNullRatings});
            } catch (err) {
                setError("Une erreur est survenue lors du chargement des avis");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, [page]);

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

    if (!data?.reviews || data.reviews.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <Star className="h-12 w-12 text-muted-foreground"/>
                <p className="text-muted-foreground">Aucun avis pour le moment</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4">
                {data.reviews.map((review, index) => (
                    <ReviewCard key={review.id} review={review} index={index}/>
                ))}
            </div>

            {data.totalPages > 1 && (
                <Pagination
                    currentPage={data.currentPage}
                    totalPages={data.totalPages}
                    basePath="/reviews"
                />
            )}
        </div>
    );
}
