import {Suspense} from "react";
import {DashboardLayout} from "@/components/Layout";
import ReviewList from "@/components/Reviews/ReviewList";
import ReviewsListLoading from "@/components/Reviews/ReviewsListLoading";

type Props = {
    searchParams: { page?: string };
};

export default function ReviewsPage({searchParams}: Props) {
    const {page} = searchParams;
    const currentPage = page || "1";

    return (
        <DashboardLayout className="py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="mb-10">
                    <div className="border-b pb-4 mb-6">
                        <h1 className="text-4xl font-bold tracking-tight">Avis des lecteurs</h1>
                        <p className="text-lg text-muted-foreground mt-2">
                            Découvrez ce que les autres lecteurs pensent des livres
                        </p>
                    </div>
                </div>

                <Suspense
                    fallback={<ReviewsListLoading/>}>
                    <ReviewList page={currentPage}/>
                </Suspense>
            </div>
        </DashboardLayout>
    );
}