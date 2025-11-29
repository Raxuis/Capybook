'use client';

import React, {memo, useMemo} from 'react';
import {Badge} from "@/types/profile";
import {motion} from "motion/react";

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
            <h2 className="mb-4 border-b border-border pb-2 text-lg font-semibold text-foreground sm:text-xl">Badges récents</h2>
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {previewBadges.map((badge, index) => (
                    <motion.div
                        key={badge.id}
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.3, delay: index * 0.1}}
                        whileHover={{scale: 1.05, y: -4}}
                        className="group col-span-4 flex w-full cursor-default flex-col items-center rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:shadow-md sm:col-span-2 sm:p-4 md:col-span-1"
                        title={isOwner ? badge.ownerDescription : badge.publicDescription}
                    >
                        <div className="mb-2 text-2xl sm:text-3xl">{badge.icon || '🏆'}</div>
                        <div className="text-center text-xs font-medium text-foreground sm:text-sm">{badge.name}</div>
                        <div
                            className="mt-1 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                            {new Date(badge.earnedAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short'
                            })}
                        </div>
                    </motion.div>
                ))}
                {remainingCount > 0 && (
                    <motion.button
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.3, delay: previewBadges.length * 0.1}}
                        whileHover={{scale: 1.05}}
                        onClick={onViewAll}
                        className="col-span-4 flex flex-col items-center justify-center rounded-lg border border-border bg-muted/50 p-3 transition-all hover:bg-muted hover:shadow-sm sm:p-4"
                    >
                        <span className="mb-2 text-2xl font-semibold text-foreground sm:text-3xl">+{remainingCount}</span>
                        <span className="text-xs text-muted-foreground">Voir tous</span>
                    </motion.button>
                )}
            </div>
        </div>
    );
});

BadgePreview.displayName = 'BadgePreview';

export default BadgePreview;
