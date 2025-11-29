"use client";

import {useEffect, useState} from "react";
import {getReviews, getReviewsCounts} from "@/actions/reviews";
import {Pagination} from "@/components/Reviews/Pagination";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import ReviewCards from "@/components/Reviews/ReviewCards";

type ReviewListProps = {
    page?: string;
};

export type Review = {
    id: string;
    rating: number;
    feedback: string | null;
    createdAt: Date;
    privacy: "PUBLIC" | "PRIVATE" | "FRIENDS" | "SPECIFIC_FRIEND";
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
                    rating: review.rating ?? 0
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

    const currentTabCount = tab === "public" ? counts?.publicCount : counts?.friendsCount;
    const totalCount = (counts?.publicCount || 0) + (counts?.friendsCount || 0);

    return (
        <div className="space-y-6">
            {/* Stats Summary */}
            {counts && totalCount > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100">
                                <span className="text-lg">⭐</span>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500">Total d'avis</p>
                                <p className="text-xl font-bold text-slate-900">{totalCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
                                <span className="text-lg">🌐</span>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500">Avis publics</p>
                                <p className="text-xl font-bold text-slate-900">{counts.publicCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-rose-100">
                                <span className="text-lg">👥</span>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500">Avis d'amis</p>
                                <p className="text-xl font-bold text-slate-900">{counts.friendsCount}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100/50 p-1">
                    <TabsTrigger
                        value="public"
                        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        <span>Publique</span>
                        {counts && (
                            <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                                {counts.publicCount}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="friends"
                        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        <span>Amis</span>
                        {counts && (
                            <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                                {counts.friendsCount}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="public" className="mt-6">
                    {data && data.reviews.length > 0 && (
                        <div className="mb-4 text-sm text-slate-600">
                            Affichage de <span className="font-semibold text-slate-900">{data.reviews.length}</span> avis sur <span className="font-semibold text-slate-900">{currentTabCount}</span>
                        </div>
                    )}
                    <ReviewCards
                        tab={tab}
                        reviews={data?.reviews}
                        isLoading={isLoading}
                        error={error}/>
                </TabsContent>

                <TabsContent value="friends" className="mt-6">
                    {data && data.reviews.length > 0 && (
                        <div className="mb-4 text-sm text-slate-600">
                            Affichage de <span className="font-semibold text-slate-900">{data.reviews.length}</span> avis sur <span className="font-semibold text-slate-900">{currentTabCount}</span>
                        </div>
                    )}
                    <ReviewCards
                        tab={tab}
                        reviews={data?.reviews}
                        isLoading={isLoading}
                        error={error}/>
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
