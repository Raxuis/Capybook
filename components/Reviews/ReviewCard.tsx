"use client";

import {motion} from "motion/react";
import {Star, BookOpen} from "lucide-react";
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
            <Card className="overflow-hidden border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                        {/* Book Cover */}
                        <Link
                            href={`/book-store?search=${encodeURIComponent(review.Book.title)}`}
                            className="shrink-0"
                        >
                            <div className="relative h-28 w-20 overflow-hidden rounded border border-slate-200/50 bg-slate-50 transition-transform duration-200 group-hover:scale-105">
                                {bookCoverUrl ? (
                                    <Image
                                        src={bookCoverUrl}
                                        alt={review.Book.title}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                ) : (
                                    <BookCoverPlaceholder
                                        title={review.Book.title}
                                        variant="default"
                                        className="p-2"
                                    />
                                )}
                            </div>
                        </Link>

                        {/* Content */}
                        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                                    <Link href={`/profile/${review.User.username}`}>
                                        <Avatar className="size-9 border border-slate-200 transition-transform duration-200 hover:scale-110 active:scale-95">
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
                                            <p className="line-clamp-1 text-xs text-slate-600 hover:text-slate-800">
                                                {review.Book.title}
                                            </p>
                                        </Link>
                                    </div>
                                </div>

                                {/* Rating & Privacy */}
                                <div className="flex shrink-0 flex-col items-end gap-1.5">
                                    <div className="flex items-center gap-1 rounded border border-amber-200/60 bg-amber-50/50 px-2 py-1">
                                        <Star className="size-3 fill-amber-500 text-amber-500"/>
                                        <span className="text-xs font-semibold text-amber-700">{review.rating}</span>
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
                                <div className="rounded border border-slate-100 bg-slate-50/50 p-2.5">
                                    <p className="line-clamp-3 text-xs leading-relaxed text-slate-700">
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
