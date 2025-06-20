import React, {memo, useCallback, useMemo} from 'react';
import {Review} from "@/types/profile";
import {Star, Eye, CheckIcon, CopyIcon} from "lucide-react";
import {useCopyToClipboard} from "@/hooks/use-copy-to-clipboard";
import {getPrivacyConfig} from "@/utils/reviews";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {Link} from "next-view-transitions";
import {Button} from "@/components/ui/button";

interface ReviewsPreviewProps {
    reviews: Review[];
    onViewAll: () => void;
}

const ReviewsPreview = memo<ReviewsPreviewProps>(({reviews, onViewAll}) => {
    const [copiedText, copy] = useCopyToClipboard();
    const getPrivacyConfigMemo = useCallback((privacy: string) => {
        return getPrivacyConfig(privacy);
    }, [])
    const previewReviews = useMemo(() => reviews.slice(0, 2), [reviews]);
    const hasMore = reviews.length > 2;

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-lg sm:text-xl font-semibold">Avis récents</h2>
                <button
                    onClick={onViewAll}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                    Voir tous
                    <Eye size={16}/>
                </button>
            </div>
            <div className="space-y-4">
                {previewReviews.map(review => (
                    <div key={review.id} className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2 flex-wrap sm:flex-nowrap">
                            <h3 className="font-semibold mr-2">{review.Book.title}</h3>
                            <div className="flex items-center space-x-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Badge
                                                variant={getPrivacyConfig(review.privacy).variant}
                                                className={cn(
                                                    "flex items-center gap-1 text-xs font-medium transition-colors",
                                                    getPrivacyConfigMemo(review.privacy)
                                                )}
                                            >
                                                {getPrivacyConfigMemo(review.privacy).label}
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className="text-sm">
                                                {
                                                    (review.privacy === "SPECIFIC_FRIEND" && review.SpecificFriend) ? (
                                                        <span>
                                                                                    Partagé avec {" "}
                                                            <Link
                                                                href={`/profile/${review.SpecificFriend.username}`}
                                                                className="underline">
                                                                                        @{review.SpecificFriend.username}
                                                                                    </Link>
                                                                                </span>
                                                    ) : (
                                                        review.privacy === "PRIVATE" ? (
                                                            <Button
                                                                onClick={() => copy(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/review/${review.privateLink}`)}
                                                            >
                                                                Copier le lien pour partager
                                                                {
                                                                    copiedText !== "" && copiedText === `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/review/${review.privateLink}` ? (
                                                                        <CheckIcon
                                                                            className="ml-1 h-4 w-4"/>
                                                                    ) : (
                                                                        <CopyIcon
                                                                            className="ml-1 h-4 w-4"/>
                                                                    )
                                                                }
                                                            </Button>
                                                        ) : (
                                                            <span>{getPrivacyConfigMemo(review.privacy).description}</span>
                                                        )
                                                    )
                                                }
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <div className="flex items-center mt-1 sm:mt-0">
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
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">{review.Book.authors.join(", ")}</p>
                        {review.feedback && (
                            <p className="text-sm sm:text-base text-gray-700">
                                {review.feedback.length > 150
                                    ? `${review.feedback.substring(0, 150)}...`
                                    : review.feedback}
                            </p>
                        )}
                        <div className="text-xs text-gray-500 mt-2">
                            Publié le {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                    </div>
                ))}
                {hasMore && (
                    <button
                        onClick={onViewAll}
                        className="w-full py-3 text-center text-blue-600 hover:text-blue-800 border-t border-gray-100 flex items-center justify-center"
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
