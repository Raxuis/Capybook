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
    searchParams: Promise<{ page?: string }>;
};

export default function ReviewsPage({searchParams}: Props) {
    const {page} = use(searchParams);
    const currentPage = page || "1";

    return (
        <DashboardLayout className="py-8">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Avis des lecteurs</h1>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Découvrez ce que les autres lecteurs pensent des livres
                    </p>
                </div>

                <Suspense
                    fallback={<ReviewsListLoading/>}>
                    <ReviewList page={currentPage}/>
                </Suspense>
            </div>
        </DashboardLayout>
    );
}
