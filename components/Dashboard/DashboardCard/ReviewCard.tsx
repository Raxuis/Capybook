import {Info, Star, MessageSquare} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Book as BookType} from "@/types";
import {Review} from "@/components/Reviews/ReviewList";
import Image from "next/image";
import {cn} from "@/lib/utils";

type ReviewCardProps = {
    review: Review;
    openBookModal: (book: BookType) => void;
};

const ReviewCard = ({review, openBookModal}: ReviewCardProps) => {
    const bookCoverUrl = review.Book.cover
        ? review.Book.cover
        : null;

    const formatReviewDate = (date: Date | string): string => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(dateObj.getTime())) return '';
        return dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <Card
            key={review.id}
            className="group relative overflow-hidden border-amber-100/60 bg-gradient-to-br from-amber-50/30 to-white transition-all duration-300 hover:border-amber-200 hover:shadow-xl"
        >
            {/* Decorative star pattern */}
            <div className="absolute right-3 top-3 opacity-5 group-hover:opacity-10 transition-opacity">
                <Star className="size-20 fill-amber-300 text-amber-300" />
            </div>

            <div className="flex gap-4 p-4">
                {/* Book Cover */}
                <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 shadow-md">
                    {bookCoverUrl ? (
                        <Image
                            src={bookCoverUrl}
                            alt={review.Book.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="96px"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <Star className="size-8 text-amber-300" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <CardTitle className="line-clamp-2 text-lg font-semibold leading-snug text-slate-900 group-hover:text-amber-700 transition-colors">
                                {review.Book.title}
                            </CardTitle>
                            <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
                                <span>{formatReviewDate(review.createdAt)}</span>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1.5">
                            {/* Rating Badge */}
                            <div className="flex items-center gap-1 rounded-full bg-amber-100/80 px-3 py-1.5 shadow-sm border border-amber-200/50">
                                <Star className="size-4 fill-amber-500 text-amber-500" />
                                <span className="text-sm font-bold text-amber-700">{review.rating}/5</span>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="size-8 bg-white/80 backdrop-blur-sm p-0 shadow-sm hover:bg-white hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                                onClick={() => openBookModal(review.Book as BookType)}
                            >
                                <Info className="size-4 text-slate-700"/>
                                <span className="sr-only">Détails</span>
                            </Button>
                        </div>
                    </div>

                    {/* Review Content */}
                    <CardContent className="p-0">
                        {review.feedback ? (
                            <div className="relative rounded-lg bg-white/60 p-3 backdrop-blur-sm border border-amber-100/50">
                                <div className="absolute left-2 top-2">
                                    <MessageSquare className="size-3.5 text-amber-400/40" />
                                </div>
                                <p className="text-sm leading-relaxed text-slate-700 pl-5">
                                    {review.feedback}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm italic text-slate-400">Pas de commentaire</p>
                        )}
                    </CardContent>
                </div>
            </div>
        </Card>
    );
};

export default ReviewCard;
