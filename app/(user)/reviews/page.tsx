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
                    <div className="mb-6 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg">
                                <span className="text-2xl">⭐</span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Avis des lecteurs</h1>
                                <p className="text-slate-600 mt-1 text-sm">
                                    Découvrez ce que les autres lecteurs pensent des livres
                                </p>
                            </div>
                        </div>
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
