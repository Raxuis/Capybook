import React, {memo, useMemo} from 'react';
import {Badge} from "@/types/profile";

interface BadgePreviewProps {
    badges: Badge[];
    isOwner: boolean;
    onViewAll: () => void;
}

const BadgePreview = memo<BadgePreviewProps>(({
                                                  badges,
                                                  isOwner,
                                                  onViewAll
                                              }) => {
    const previewBadges = useMemo(() => badges.slice(0, 4), [badges]);
    const remainingCount = badges.length - 4;

    return (
        <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 border-b pb-2">Badges récents</h2>
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {previewBadges.map(badge => (
                    <div
                        key={badge.id}
                        className="col-span-4 sm:col-span-2 md:col-span-1 group flex flex-col items-center bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-all w-full cursor-default"
                        title={isOwner ? badge.ownerDescription : badge.publicDescription}
                    >
                        <div className="text-2xl sm:text-3xl mb-2">{badge.icon || '🏆'}</div>
                        <div className="text-xs sm:text-sm font-medium text-center">{badge.name}</div>
                        <div
                            className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {new Date(badge.earnedAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short'
                            })}
                        </div>
                    </div>
                ))}
                {remainingCount > 0 && (
                    <button
                        onClick={onViewAll}
                        className="col-span-4 flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-2xl sm:text-3xl mb-2">+{remainingCount}</span>
                        <span className="text-xs text-gray-500">Voir tous</span>
                    </button>
                )}
            </div>
        </div>
    );
});

BadgePreview.displayName = 'BadgePreview';

export default BadgePreview;