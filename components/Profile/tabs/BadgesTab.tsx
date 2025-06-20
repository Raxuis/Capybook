import React, {memo, useMemo} from 'react';
import {Badge} from "../types";
import {formatBadgeCategory} from "@/utils/format";

interface BadgesTabProps {
    badges?: Badge[];
    isOwner: boolean;
}

const BadgesTab = memo<BadgesTabProps>(({badges, isOwner}) => {
    const badgesByCategory = useMemo(() => {
        if (!badges) return {};
        return badges.reduce((acc, badge) => {
            const category = badge.category || 'Other';
            if (!acc[category]) acc[category] = [];
            acc[category].push(badge);
            return acc;
        }, {} as Record<string, Badge[]>);
    }, [badges]);

    if (!badges || badges.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold">Aucun badge pour le moment</h3>
                <p className="text-gray-500 mt-2">Continuez à lire et à écrire des avis pour débloquer des badges.</p>
            </div>
        );
    }
    return (
        <>
            {Object.entries(badgesByCategory).map(([category, categoryBadges]) => (
                <div key={category} className="mb-8">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 border-b pb-2">
                        {formatBadgeCategory(category)}
                        <span className="text-sm text-gray-500 font-normal ml-2">
              ({categoryBadges.length})
            </span>
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                        {categoryBadges.map(badge => (
                            <div
                                key={badge.id}
                                className="flex flex-col items-center bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{badge.icon || '🏆'}</div>
                                <div className="text-xs sm:text-sm font-medium text-center">{badge.name}</div>
                                <div className="text-xs text-gray-500 mt-2 text-center line-clamp-2">
                                    {isOwner ? badge.ownerDescription : badge.publicDescription}
                                </div>
                                <div className="text-xs text-blue-600 mt-2 sm:mt-3">
                                    Obtenu le {new Date(badge.earnedAt).toLocaleDateString('fr-FR')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
});

BadgesTab.displayName = 'BadgesTab';

export default BadgesTab;
