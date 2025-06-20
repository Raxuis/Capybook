import React, {memo, useCallback} from 'react';
import {useRouter} from "nextjs-toploader/app";
import {ChartBarIcon, ChevronRight} from "lucide-react";
import {Button, buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {ProfileData, Badge} from "@/types/profile";
import StatsCards from "../StatsCards";
import BadgePreview from "../BadgePreview";
import BooksPreview from "../BooksPreview";
import ReviewsPreview from "../ReviewsPreview";

interface OverviewTabProps {
    stats?: ProfileData['stats'];
    badges?: Badge[];
    detailedData?: ProfileData['detailedData'];
    isOwner: boolean;
    onTabChange: (tab: string) => void;
}

const OverviewTab = memo<OverviewTabProps>(({
                                                stats,
                                                badges,
                                                detailedData,
                                                isOwner,
                                                onTabChange
                                            }) => {
    const router = useRouter();

    const handleDashboardClick = useCallback(() => {
        router.push('/book-shelf');
    }, [router]);

    const handleBadgesClick = useCallback(() => {
        onTabChange("badges");
    }, [onTabChange]);

    const handleBooksClick = useCallback(() => {
        onTabChange("books");
    }, [onTabChange]);

    const handleReviewsClick = useCallback(() => {
        onTabChange("reviews");
    }, [onTabChange]);

    return (
        <>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center mb-2 sm:mb-0">
                    <span className="bg-blue-100 p-1 rounded-md mr-2 flex-shrink-0">
                        <ChartBarIcon size={18} className="text-blue-700"/>
                    </span>
                    <span className="truncate">Vos statistiques</span>
                </h2>
                <Button
                    onClick={handleDashboardClick}
                    className={cn(buttonVariants({
                        variant: "default",
                        size: "sm",
                    }), "text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors flex items-center shadow-sm whitespace-nowrap")}
                >
                    <span className="hidden sm:inline">Tableau de bord</span>
                    <span className="sm:hidden">Dashboard</span>
                    <ChevronRight size={14} className="ml-1"/>
                </Button>
            </div>

            <StatsCards
                totalBooksRead={stats?.totalBooksRead || 0}
                totalReviews={stats?.totalReviews || 0}
                totalBadges={badges?.length || 0}
            />

            {badges && badges.length > 0 && (
                <BadgePreview
                    badges={badges}
                    isOwner={isOwner}
                    onViewAll={handleBadgesClick}
                />
            )}

            {isOwner && detailedData && detailedData.books.length > 0 && (
                <BooksPreview
                    books={detailedData.books}
                    onViewAll={handleBooksClick}
                />
            )}

            {isOwner && detailedData && detailedData.reviews.length > 0 && (
                <ReviewsPreview
                    reviews={detailedData.reviews}
                    onViewAll={handleReviewsClick}
                />
            )}
        </>
    );
});

OverviewTab.displayName = 'OverviewTab';

export default OverviewTab;