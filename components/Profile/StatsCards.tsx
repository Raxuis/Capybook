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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl shadow-sm flex items-center">
                <div className="bg-blue-600 p-3 rounded-lg mr-4">
                    <Book size={24} className="text-white"/>
                </div>
                <div>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-900">{totalBooksRead}</div>
                    <div className="text-sm text-blue-700">Livres lus</div>
                </div>
            </div>

            <div
                className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-xl shadow-sm flex items-center">
                <div className="bg-purple-600 p-3 rounded-lg mr-4">
                    <Star size={24} className="text-white"/>
                </div>
                <div>
                    <div className="text-2xl sm:text-3xl font-bold text-purple-900">{totalReviews}</div>
                    <div className="text-sm text-purple-700">Avis publiés</div>
                </div>
            </div>

            <div
                className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 sm:p-6 rounded-xl shadow-sm flex items-center">
                <div className="bg-amber-600 p-3 rounded-lg mr-4">
                    <Award size={24} className="text-white"/>
                </div>
                <div>
                    <div className="text-2xl sm:text-3xl font-bold text-amber-900">{totalBadges}</div>
                    <div className="text-sm text-amber-700">Badges obtenus</div>
                </div>
            </div>
        </div>
    );
});

StatsCards.displayName = 'StatsCards';

export default StatsCards;