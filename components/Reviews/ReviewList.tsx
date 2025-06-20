"use client";

import {useEffect, useState} from "react";
import {getReviews, getReviewsCounts} from "@/actions/reviews";
import ReviewCard from "@/components/Reviews/ReviewCard";
import {Pagination} from "@/components/Reviews/Pagination";
import {Star} from "lucide-react";
import ReviewsListLoading from "./ReviewsListLoading";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import ReviewCards from "@/components/Reviews/ReviewCards";

type ReviewListProps = {
    page?: string;
};

export type Review = {
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

type ReviewsCounts = {
    publicCount: number;
    friendsCount: number;
};

export default function ReviewList({page = "1"}: ReviewListProps) {
    const [data, setData] = useState<ReviewsData | null>(null);
    const [counts, setCounts] = useState<ReviewsCounts | null>(null);
    const [tab, setTab] = useState<"public" | "friends">("public");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const reviewsCounts = await getReviewsCounts();
                setCounts(reviewsCounts);
            } catch (err) {
                console.error("Error fetching counts:", err);
            }
        };

        fetchCounts();
    }, []);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setIsLoading(true);
                const currentPage = parseInt(page);
                const reviewsData = await getReviews(currentPage, 10, tab);
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
    }, [page, tab]);

    const handleTabChange = (value: string) => {
        if (value === "public" || value === "friends") {
            setTab(value);
            // Reset to first page when changing tabs
            if (page !== "1") {
                window.history.pushState({}, '', `/reviews?page=1`);
            }
        }
    };

    return (
        <div className="space-y-6">
            <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="public" className="flex items-center gap-2">
                        Publique
                        {counts && (
                            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                                {counts.publicCount}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="friends" className="flex items-center gap-2">
                        Amis
                        {counts && (
                            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                                {counts.friendsCount}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="public" className="mt-6">
                    <ReviewCards reviews={data?.reviews} isLoading={isLoading} error={error}/>
                </TabsContent>

                <TabsContent value="friends" className="mt-6">
                    <ReviewCards reviews={data?.reviews} isLoading={isLoading} error={error}/>
                </TabsContent>
            </Tabs>

            {data && data.totalPages > 1 && (
                <Pagination
                    currentPage={data.currentPage}
                    totalPages={data.totalPages}
                    basePath={`/reviews?tab=${tab}`}
                />
            )}
        </div>
    );
}