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
            <h2 className="border-border text-foreground mb-4 border-b pb-2 text-lg font-semibold sm:text-xl">Badges récents</h2>
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {previewBadges.map((badge, index) => (
                    <motion.div
                        key={badge.id}
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.3, delay: index * 0.1}}
                        whileHover={{ y: -4}}
                        style={{transition: "transform 0.1s ease-out"}}
                        className="border-border bg-card group col-span-4 flex w-full cursor-default flex-col items-center rounded-lg border p-3 shadow-sm transition-all hover:shadow-md sm:col-span-2 sm:p-4 md:col-span-1"
                        title={isOwner ? badge.ownerDescription : badge.publicDescription}
                    >
                        <div className="mb-2 text-2xl sm:text-3xl">{badge.icon || '🏆'}</div>
                        <div className="text-foreground text-center text-xs font-medium sm:text-sm">{badge.name}</div>
                        <div
                            className="text-muted-foreground mt-1 text-xs opacity-0 transition-opacity group-hover:opacity-100">
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
                        style={{transition: "transform 0.1s ease-out"}}
                        onClick={onViewAll}
                        className="border-border bg-muted/50 hover:bg-muted col-span-4 flex flex-col items-center justify-center rounded-lg border p-3 transition-all hover:shadow-sm sm:p-4"
                    >
                        <span className="text-foreground mb-2 text-2xl font-semibold sm:text-3xl">+{remainingCount}</span>
                        <span className="text-muted-foreground text-xs">Voir tous</span>
                    </motion.button>
                )}
            </div>
        </div>
    );
});

BadgePreview.displayName = 'BadgePreview';

export default BadgePreview;
