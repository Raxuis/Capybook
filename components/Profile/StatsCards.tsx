import React, {memo} from 'react';
import {Book, Star, Award} from "lucide-react";

interface StatsCardsProps {
    totalBooksRead: number;
    totalReviews: number;
    totalBadges: number;
}

const StatsCards = memo<StatsCardsProps>(({
                                              totalBooksRead,
                                              totalReviews,
                                              totalBadges
                                          }) => {
    return (
        <div className="mb-8 grid grid-cols-3 gap-2 md:gap-4">
            <div className="flex h-full items-center justify-center rounded-lg border bg-card p-2 transition-all hover:shadow-md md:p-4">
                <div className="flex w-full flex-col items-center">
                    <div className="relative">
                        <div className="flex items-center justify-center rounded-full bg-green-800/10 p-3">
                            <Book className="size-5 text-green-800 md:size-6"/>
                        </div>
                        <div className="absolute -bottom-2 -right-2 flex size-6 items-center justify-center rounded-full border-2 border-white bg-green-600 text-xs font-semibold text-white">
                            {totalBooksRead}
                        </div>
                    </div>
                    <p className="mt-4 text-center text-xs font-medium md:text-sm">Livres lus</p>
                </div>
            </div>

            <div className="flex h-full items-center justify-center rounded-lg border bg-card p-2 transition-all hover:shadow-md md:p-4">
                <div className="flex w-full flex-col items-center">
                    <div className="relative">
                        <div className="bg-primary/10 flex items-center justify-center rounded-full p-3">
                            <Star className="text-primary size-5 md:size-6"/>
                        </div>
                        <div className="bg-primary absolute -bottom-2 -right-2 flex size-6 items-center justify-center rounded-full border-2 border-white text-xs font-semibold text-white">
                            {totalReviews}
                        </div>
                    </div>
                    <p className="mt-4 text-center text-xs font-medium md:text-sm">Avis publiés</p>
                </div>
            </div>

            <div className="flex h-full items-center justify-center rounded-lg border bg-card p-2 transition-all hover:shadow-md md:p-4">
                <div className="flex w-full flex-col items-center">
                    <div className="relative">
                        <div className="flex items-center justify-center rounded-full bg-rose-100 p-3">
                            <Award className="size-5 text-rose-500 md:size-6"/>
                        </div>
                        <div className="absolute -bottom-2 -right-2 flex size-6 items-center justify-center rounded-full border-2 border-white bg-rose-500 text-xs font-semibold text-white">
                            {totalBadges}
                        </div>
                    </div>
                    <p className="mt-4 text-center text-xs font-medium md:text-sm">Badges obtenus</p>
                </div>
            </div>
        </div>
    );
});

StatsCards.displayName = 'StatsCards';

export default StatsCards;
