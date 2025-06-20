"use client";

import {motion} from "motion/react";
import {Star} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {formatDistanceToNow} from "date-fns";
import {fr} from "date-fns/locale";
import {cn} from "@/lib/utils";
import {getPrivacyConfig} from "@/utils/reviews";

type ReviewCardProps = {
    review: {
        id: string;
        rating: number;
        feedback: string | null;
        privacy: "PUBLIC" | "PRIVATE" | "FRIENDS" | "SPECIFIC_FRIEND";
        createdAt: string;
        User: {
            username: string;
            image: string | null;
            favoriteColor: string | null;
        };
        Book: {
            title: string;
            cover: string | null;
        };
    };
    index: number;
};

const ReviewCard = ({review, index}: ReviewCardProps) => {
    const getInitials = (username: string) => {
        return username
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    const privacyConfig = getPrivacyConfig(review.privacy);
    const PrivacyIcon = privacyConfig.icon;

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3, delay: index * 0.1}}
            whileHover={{scale: 1.02}}
            className="group"
        >
            <Card className="overflow-hidden border-gray-100 transition-all duration-200 hover:shadow-md">
                <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={review.User.image || undefined}/>
                                <AvatarFallback style={{backgroundColor: review.User.favoriteColor || "#3b82f6"}}>
                                    {getInitials(review.User.username)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-sm">{review.User.username}</p>
                                <p className="text-xs text-muted-foreground">
                                    {review.Book.title}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Badge
                                variant={privacyConfig.variant}
                                className={cn(
                                    "flex items-center gap-1 text-xs font-medium transition-colors",
                                    privacyConfig.className
                                )}
                            >
                                <PrivacyIcon className="h-3 w-3" />
                                {privacyConfig.label}
                            </Badge>
                            <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-amber-500 fill-current"/>
                                <span className="text-sm font-medium">{review.rating}/5</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className={cn(
                            "text-sm text-muted-foreground leading-relaxed",
                            !review.feedback && "italic"
                        )}>
                            {review.feedback || "Pas de commentaire"}
                        </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                            {formatDistanceToNow(new Date(review.createdAt), {
                                addSuffix: true,
                                locale: fr
                            })}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ReviewCard;