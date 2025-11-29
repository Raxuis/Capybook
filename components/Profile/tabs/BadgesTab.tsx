'use client';

import React, {memo, useMemo} from 'react';
import {formatBadgeCategory} from "@/lib/helpers/format";
import {Badge} from "@/types/profile";
import {motion} from "motion/react";

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
            <div className="py-12 text-center">
                <div className="mb-4 text-4xl">🏆</div>
                <h3 className="text-xl font-semibold text-foreground">Aucun badge pour le moment</h3>
                <p className="mt-2 text-muted-foreground">Continuez à lire et à écrire des avis pour débloquer des badges.</p>
            </div>
        );
    }
    return (
        <>
            {Object.entries(badgesByCategory).map(([category, categoryBadges], categoryIndex) => (
                <motion.div
                    key={category}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.4, delay: categoryIndex * 0.1}}
                    className="mb-8"
                >
                    <h2 className="mb-4 border-b border-border pb-2 text-lg font-semibold text-foreground sm:text-xl">
                        {formatBadgeCategory(category)}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({categoryBadges.length})
            </span>
                    </h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
                        {categoryBadges.map((badge, index) => (
                            <motion.div
                                key={badge.id}
                                initial={{opacity: 0, scale: 0.9}}
                                animate={{opacity: 1, scale: 1}}
                                transition={{duration: 0.3, delay: (categoryIndex * 0.1) + (index * 0.05)}}
                                whileHover={{scale: 1.05, y: -4}}
                                className="flex flex-col items-center rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:shadow-md sm:p-4"
                            >
                                <div className="mb-2 text-3xl sm:mb-3 sm:text-4xl">{badge.icon || '🏆'}</div>
                                <div className="text-center text-xs font-medium text-foreground sm:text-sm">{badge.name}</div>
                                <div className="mt-2 line-clamp-2 text-center text-xs text-muted-foreground">
                                    {isOwner ? badge.ownerDescription : badge.publicDescription}
                                </div>
                                <div className="mt-2 text-xs text-primary sm:mt-3">
                                    Obtenu le {new Date(badge.earnedAt).toLocaleDateString('fr-FR')}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            ))}
        </>
    );
});

BadgesTab.displayName = 'BadgesTab';

export default BadgesTab;
