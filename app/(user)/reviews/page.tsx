import {Suspense, use} from "react";
import {DashboardLayout} from "@/components/Layout";
import ReviewList from "@/components/Reviews/ReviewList";
import ReviewsListLoading from "@/components/Reviews/ReviewsListLoading";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Avis des lecteurs - Capybook",
    description: "Découvrez les avis des lecteurs sur les livres que vous aimez.",
};

type Props = {
    searchParams: { page?: string };
};

export default function ReviewsPage({searchParams}: Props) {
    const {page} = use(searchParams);
    const currentPage = page || "1";

    return (
        <DashboardLayout className="py-8">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mb-10">
                    <div className="mb-6 border-b pb-4">
                        <h1 className="text-4xl font-bold tracking-tight">Avis des lecteurs</h1>
                        <p className="text-muted-foreground mt-2 text-lg">
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