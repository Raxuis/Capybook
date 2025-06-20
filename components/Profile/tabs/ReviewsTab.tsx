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
import {Button} from "@/components/ui/button";
import {getPrivacyConfig} from "@/utils/reviews";
import {cn} from "@/lib/utils";
import {useCopyToClipboard} from "@/hooks/use-copy-to-clipboard";

interface ReviewsTabProps {
    reviews: Review[];
}

const ReviewsTab = memo<ReviewsTabProps>(({reviews}) => {
    const [copiedText, copy] = useCopyToClipboard();
    const getPrivacyConfigMemo = useCallback((privacy: string) => {
        return getPrivacyConfig(privacy);
    }, [])

    if (!reviews.length) {
        return (
            <div className="text-center py-12">
                <div className="text-4xl mb-4">✒️</div>
                <h3 className="text-xl font-semibold">Aucun avis pour le moment</h3>
                <p className="text-gray-500 mt-2">Partagez votre opinion sur les livres que vous avez lus.</p>
            </div>
        );
    }


    return (
        <div className="space-y-4 sm:space-y-6">
            {reviews.map(review => (
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
                                                        <span>
                                                                                    {getPrivacyConfigMemo(review.privacy).description}
                                                                                </span>
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
                                        size={16}
                                        className="sm:ml-0.5"
                                        fill={i < (review.rating ?? 0) ? "#FBBF24" : "none"}
                                        stroke={i < (review.rating ?? 0) ? "#FBBF24" : "#D1D5DB"}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3">{review.Book.authors.join(", ")}</p>
                    {review.feedback && (
                        <p className="text-sm sm:text-base text-gray-700">{review.feedback}</p>
                    )}
                    <div className="text-xs text-gray-500 mt-3">
                        Publié le {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                </div>
            ))}
        </div>
    );
});

ReviewsTab.displayName = 'ReviewsTab';

export default ReviewsTab;
