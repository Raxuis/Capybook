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
                <h3 className="text-xl font-semibold">Aucun avis pour le moment</h3>
                <p className="mt-2 text-gray-500">Partagez votre opinion sur les livres que vous avez lus.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {reviews.map(review => {
                const privacyConfig = getPrivacyConfigMemo(review.privacy);
                const PrivacyIcon = privacyConfig.icon;
                return (
                    <div key={review.id} className="rounded-lg bg-gray-50 p-3 sm:p-4">
                        <div className="mb-2 flex flex-wrap items-start justify-between sm:flex-nowrap">
                            <h3 className="mr-2 font-semibold">{review.Book.title}</h3>
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
                                            className="sm:ml-0.5"
                                            fill={i < (review.rating ?? 0) ? "#FBBF24" : "none"}
                                            stroke={i < (review.rating ?? 0) ? "#FBBF24" : "#D1D5DB"}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="mb-3 text-xs text-gray-600 sm:text-sm">{review.Book.authors.join(", ")}</p>
                        {review.feedback && (
                            <p className="text-sm text-gray-700 sm:text-base">{review.feedback}</p>
                        )}
                        <div className="mt-3 text-xs text-gray-500">
                            Publié le {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                    </div>
                )
            })}
        </div>
    );
});

ReviewsTab.displayName = 'ReviewsTab';

export default ReviewsTab;