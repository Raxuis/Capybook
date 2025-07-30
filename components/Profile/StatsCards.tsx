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
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <div
                className="flex items-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-sm sm:p-6">
                <div className="mr-4 rounded-lg bg-blue-600 p-3">
                    <Book size={24} className="text-white"/>
                </div>
                <div>
                    <div className="text-2xl font-bold text-blue-900 sm:text-3xl">{totalBooksRead}</div>
                    <div className="text-sm text-blue-700">Livres lus</div>
                </div>
            </div>

            <div
                className="flex items-center rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-4 shadow-sm sm:p-6">
                <div className="mr-4 rounded-lg bg-purple-600 p-3">
                    <Star size={24} className="text-white"/>
                </div>
                <div>
                    <div className="text-2xl font-bold text-purple-900 sm:text-3xl">{totalReviews}</div>
                    <div className="text-sm text-purple-700">Avis publiés</div>
                </div>
            </div>

            <div
                className="flex items-center rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 p-4 shadow-sm sm:p-6">
                <div className="mr-4 rounded-lg bg-amber-600 p-3">
                    <Award size={24} className="text-white"/>
                </div>
                <div>
                    <div className="text-2xl font-bold text-amber-900 sm:text-3xl">{totalBadges}</div>
                    <div className="text-sm text-amber-700">Badges obtenus</div>
                </div>
            </div>
        </div>
    );
});

StatsCards.displayName = 'StatsCards';

export default StatsCards;