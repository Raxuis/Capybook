import {Suspense} from "react";
import {getReviews} from "@/actions/reviews";
import ReviewCard from "@/components/Reviews/ReviewCard";
import {ReviewPlaceholder} from "@/components/Reviews/ReviewPlaceholder";
import {Star} from "lucide-react";
import {DashboardLayout} from "@/components/Layout";

async function ReviewsList() {
    const reviews = await getReviews();

    console.log("reviews", reviews)

    if (!reviews || reviews.length === 0) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center space-y-4 py-12">
                    <Star className="h-12 w-12 text-muted-foreground"/>
                    <p className="text-muted-foreground">Aucun avis pour le moment</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <div className="grid gap-4">
            {reviews.map((review, index) => (
                <ReviewCard key={review.id} review={{
                    ...review,
                    rating: review.rating ?? 0,
                    createdAt: review.createdAt.toISOString(),
                    User: {...review.User, username: review.User.username ?? ''}
                }} index={index}/>
            ))}
        </div>
    );
}

export default function ReviewsPage() {
    return (
        <DashboardLayout className="py-8">
            <div className="space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Avis des lecteurs</h1>
                    <p className="text-muted-foreground">
                        Découvrez ce que les autres lecteurs pensent des livres
                    </p>
                </div>

                <Suspense
                    fallback={
                        <div className="grid gap-4">
                            {[...Array(3)].map((_, i) => (
                                <ReviewPlaceholder key={i}/>
                            ))}
                        </div>
                    }
                >
                    <ReviewsList/>
                </Suspense>
            </div>
        </DashboardLayout>
    );
}
