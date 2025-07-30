import React, {memo, useCallback} from 'react';
import {Review} from "@/types/profile";
import {Star, Eye, CheckIcon, CopyIcon} from "lucide-react";
import {useCopyToClipboard} from "@/hooks/use-copy-to-clipboard";
import {getPrivacyConfig} from "@/utils/reviews";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {Link} from "next-view-transitions";

interface ReviewsPreviewProps {
    reviews: Review[];
    onViewAll: () => void;
}

const ReviewsPreview = memo<ReviewsPreviewProps>(({reviews, onViewAll}) => {
    const {copiedText, copy} = useCopyToClipboard();
    const getPrivacyConfigMemo = useCallback((privacy: string) => {
        return getPrivacyConfig(privacy);
    }, [])
    const hasMore = reviews.length > 2;

    return (
        <div className="mb-6">
            <div className="mb-4 flex items-center justify-between border-b pb-2">
                <h2 className="text-lg font-semibold sm:text-xl">Avis récents</h2>
                <button
                    onClick={onViewAll}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                    Voir tous
                    <Eye size={16}/>
                </button>
            </div>
            <div className="space-y-4">
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
                                                size={14}
                                                className="sm:ml-0.5"
                                                fill={i < (review.rating ?? 0) ? "#FBBF24" : "none"}
                                                stroke={i < (review.rating ?? 0) ? "#FBBF24" : "#D1D5DB"}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="mb-2 text-xs text-gray-600 sm:text-sm">{review.Book.authors.join(", ")}</p>
                            {
                                review.feedback && (
                                    <p className="text-sm text-gray-700 sm:text-base">
                                        {review.feedback.length > 150
                                            ? `${review.feedback.substring(0, 150)}...`
                                            : review.feedback}
                                    </p>
                                )
                            }
                            <div className="mt-2 text-xs text-gray-500">
                                Publié le {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                            </div>
                        </div>
                    )
                })}
                {hasMore && (
                    <button
                        onClick={onViewAll}
                        className="flex w-full items-center justify-center border-t border-gray-100 py-3 text-center text-blue-600 hover:text-blue-800"
                    >
                        <Eye size={16} className="mr-2"/>
                        Voir plus d&#39;avis
                    </button>
                )}
            </div>
        </div>
    );
});

ReviewsPreview.displayName = 'ReviewsPreview';

export default ReviewsPreview;
