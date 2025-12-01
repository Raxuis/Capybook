'use client';

import React, {memo, useCallback} from 'react';
import {Review} from "@/types/profile";
import {CheckIcon, CopyIcon, Star} from "lucide-react";
import {Link} from "next-view-transitions";
import {
    TooltipTrigger,
    Tooltip,
    TooltipContent,
    TooltipProvider
} from "@/components/ui/tooltip"
import {Badge} from "@/components/ui/badge";
import {getPrivacyConfig} from "@/utils/reviews";
import {cn} from "@/lib/utils";
import {useCopyToClipboard} from "@/hooks/use-copy-to-clipboard";
import {motion} from "motion/react";

interface ReviewsTabProps {
    reviews: Review[];
}

const ReviewsTab = memo<ReviewsTabProps>(({reviews}) => {
    const {copiedText, copy} = useCopyToClipboard();
    const getPrivacyConfigMemo = useCallback((privacy: string) => {
        return getPrivacyConfig(privacy);
    }, [])

    if (!reviews.length) {
        return (
            <div className="py-12 text-center">
                <div className="mb-4 text-4xl">✒️</div>
                <h3 className="text-foreground text-xl font-semibold">Aucun avis pour le moment</h3>
                <p className="text-muted-foreground mt-2">Partagez votre opinion sur les livres que vous avez lus.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {reviews.map((review, index) => {
                const privacyConfig = getPrivacyConfigMemo(review.privacy);
                const PrivacyIcon = privacyConfig.icon;
                return (
                    <motion.div
                        key={review.id}
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.3, delay: index * 0.05}}
                        whileHover={{y: -2}}
                        className="border-border bg-card rounded-lg border p-3 shadow-sm transition-all hover:shadow-md sm:p-4"
                    >
                        <div className="mb-2 flex flex-wrap items-start justify-between sm:flex-nowrap">
                            <h3 className="text-foreground mr-2 font-semibold">{review.Book.title}</h3>
                            <div className="flex items-center space-x-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Badge
                                                variant={privacyConfig.variant}
                                                className={cn(
                                                    "flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer",
                                                    privacyConfig.className
                                                )}
                                            >
                                                <PrivacyIcon className="size-3"/>
                                                {privacyConfig.label}
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent asChild className={cn("p-0", privacyConfig.className)}>
                                            {
                                                (review.privacy === "SPECIFIC_FRIEND" && review.SpecificFriend) ? (
                                                    <div
                                                        className={cn(
                                                            "text-sm px-3 py-2 rounded-md",
                                                            privacyConfig.className
                                                        )}
                                                    >
                                                        <span className="flex items-center gap-1">
                                                          Partagé avec{" "}
                                                            <Link
                                                                href={`/profile/${review.SpecificFriend.username}`}
                                                                className="underline"
                                                            >
                                                            @{review.SpecificFriend.username}
                                                          </Link>
                                                        </span>
                                                    </div>
                                                ) : review.privacy === "PRIVATE" ? (
                                                    <div
                                                        className={cn(
                                                            "text-sm px-3 py-2 rounded-md cursor-pointer flex items-center gap-1",
                                                            privacyConfig.className
                                                        )}
                                                        onClick={() => copy(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/private-review/${review.id}`)}
                                                    >
                                                        Copier le lien pour partager
                                                        {copiedText !== "" && copiedText === `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/private-review/${review.id}` ? (
                                                            <CheckIcon className="ml-1 size-4"/>
                                                        ) : (
                                                            <CopyIcon className="ml-1 size-4"/>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div
                                                        className={cn(
                                                            "text-sm px-3 py-2 rounded-md",
                                                            privacyConfig.className
                                                        )}
                                                    >
                                                        {privacyConfig.description}
                                                    </div>
                                                )
                                            }
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <div className="mt-1 flex items-center sm:mt-0">
                                    {review.rating && Array.from({length: 5}).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={cn(
                                                "sm:ml-0.5",
                                                i < (review.rating ?? 0) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                                            )}
                                            fill={i < (review.rating ?? 0) ? "#FBBF24" : "none"}
                                            stroke={i < (review.rating ?? 0) ? "#FBBF24" : "currentColor"}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="text-muted-foreground mb-3 text-xs sm:text-sm">{review.Book.authors.join(", ")}</p>
                        {review.feedback && (
                            <p className="text-foreground text-sm sm:text-base">{review.feedback}</p>
                        )}
                        <div className="text-muted-foreground mt-3 text-xs">
                            Publié le {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                    </motion.div>
                )
            })}
        </div>
    );
});

ReviewsTab.displayName = 'ReviewsTab';

export default ReviewsTab;
