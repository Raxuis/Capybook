"use client";

import {motion} from "motion/react";
import {Star, BookOpen, MessageSquare} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {formatDistanceToNow} from "date-fns";
import {fr} from "date-fns/locale";
import {cn} from "@/lib/utils";
import {getPrivacyConfig} from "@/utils/reviews";
import {Review} from "@/components/Reviews/ReviewList";
import Image from "next/image";
import Link from "next/link";
import {BookCoverPlaceholder} from "@/components/common/BookCoverPlaceholder";

type ReviewCardProps = {
    review: Review
    index?: number;
};

const ReviewCard = ({review, index}: ReviewCardProps) => {
    const getInitials = (username: string) => {
        return username
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const privacyConfig = getPrivacyConfig(review.privacy);
    const PrivacyIcon = privacyConfig.icon;

    const bookCoverUrl = review.Book.cover || null;

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3, delay: index ? index * 0.05 : 0}}
            className="group"
        >
            <Card className="overflow-hidden border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-md">
                <CardContent className="p-0">
                    <div className="flex gap-4 p-5">
                        {/* Book Cover */}
                        <Link
                            href={`/profile/${review.User.username}`}
                            className="shrink-0"
                        >
                            <div className="relative h-32 w-24 overflow-hidden rounded-lg border border-slate-200/60 bg-slate-50 transition-transform duration-200 group-hover:scale-105">
                                {bookCoverUrl ? (
                                    <Image
                                        src={bookCoverUrl}
                                        alt={review.Book.title}
                                        fill
                                        className="object-cover"
                                        sizes="96px"
                                    />
                                ) : (
                                    <BookCoverPlaceholder
                                        title={review.Book.title}
                                        variant="amber"
                                        className="p-2"
                                    />
                                )}
                            </div>
                        </Link>

                        {/* Content */}
                        <div className="flex min-w-0 flex-1 flex-col gap-3">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                    <Link href={`/profile/${review.User.username}`}>
                                        <Avatar className="size-10 border-2 border-slate-200 transition-transform duration-200 hover:scale-110">
                                            <AvatarImage src={review.User.image || undefined}/>
                                            <AvatarFallback
                                                className="text-xs font-semibold"
                                                style={{backgroundColor: review.User.favoriteColor || "#3b82f6"}}
                                            >
                                                {getInitials(review.User.username)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className="min-w-0 flex-1">
                                        <Link
                                            href={`/profile/${review.User.username}`}
                                            className="block"
                                        >
                                            <p className="text-sm font-semibold text-slate-900 hover:text-slate-700">
                                                {review.User.username}
                                            </p>
                                        </Link>
                                        <Link
                                            href={`/book-store?search=${encodeURIComponent(review.Book.title)}`}
                                            className="block"
                                        >
                                            <p className="text-xs text-slate-600 hover:text-slate-800 line-clamp-1">
                                                {review.Book.title}
                                            </p>
                                        </Link>
                                    </div>
                                </div>

                                {/* Rating & Privacy */}
                                <div className="flex shrink-0 flex-col items-end gap-2">
                                    <div className="flex items-center gap-1.5 rounded-lg border border-amber-200/60 bg-amber-50/50 px-2.5 py-1.5">
                                        <Star className="size-3.5 fill-amber-500 text-amber-500"/>
                                        <span className="text-sm font-bold text-amber-700">{review.rating}</span>
                                    </div>
                                    <Badge
                                        variant={privacyConfig.variant}
                                        className={cn(
                                            "flex items-center gap-1 text-[10px] font-medium",
                                            privacyConfig.className
                                        )}
                                    >
                                        <PrivacyIcon className="size-2.5"/>
                                        {privacyConfig.label}
                                    </Badge>
                                </div>
                            </div>

                            {/* Review Content */}
                            {review.feedback && (
                                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                                    <div className="mb-1.5 flex items-center gap-1.5">
                                        <MessageSquare className="size-3 text-slate-400"/>
                                        <span className="text-xs font-medium text-slate-500">Commentaire</span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-slate-700 line-clamp-3">
                                        {review.feedback}
                                    </p>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <BookOpen className="size-3"/>
                                    {formatDistanceToNow(review.createdAt, {
                                        addSuffix: true,
                                        locale: fr
                                    })}
                                </span>
                                {!review.feedback && (
                                    <span className="italic">Pas de commentaire</span>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ReviewCard;
