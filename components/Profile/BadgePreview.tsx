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
            <h2 className="mb-4 border-b pb-2 text-lg font-semibold sm:text-xl">Badges récents</h2>
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {previewBadges.map(badge => (
                    <div
                        key={badge.id}
                        className="group col-span-4 flex w-full cursor-default flex-col items-center rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md sm:col-span-2 sm:p-4 md:col-span-1"
                        title={isOwner ? badge.ownerDescription : badge.publicDescription}
                    >
                        <div className="mb-2 text-2xl sm:text-3xl">{badge.icon || '🏆'}</div>
                        <div className="text-center text-xs font-medium sm:text-sm">{badge.name}</div>
                        <div
                            className="mt-1 text-xs text-gray-500 opacity-0 transition-opacity group-hover:opacity-100">
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
                        className="col-span-4 flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100 sm:p-4"
                    >
                        <span className="mb-2 text-2xl sm:text-3xl">+{remainingCount}</span>
                        <span className="text-xs text-gray-500">Voir tous</span>
                    </button>
                )}
            </div>
        </div>
    );
});

BadgePreview.displayName = 'BadgePreview';

export default BadgePreview;
