import {Info, Star} from "lucide-react";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Book as BookType} from "@/types";
import {Review} from "@/components/Reviews/ReviewList";
import Image from "next/image";
import {BookCoverPlaceholder} from "@/components/common/BookCoverPlaceholder";

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
        return dateObj.toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'});
    };

    return (
        <Card
            key={review.id}
            className="group relative overflow-hidden border border-amber-200/60 bg-white transition-all duration-200 hover:border-amber-300 hover:shadow-md hover:-translate-y-0.5"
        >
            <div className="flex gap-3 p-4">
                {/* Book Cover - more compact */}
                <div
                    className="relative h-28 w-20 shrink-0 overflow-hidden rounded border border-slate-200/50 bg-slate-50">
                    {bookCoverUrl ? (
                        <Image
                            src={bookCoverUrl}
                            alt={review.Book.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            sizes="80px"
                        />
                    ) : (
                        <BookCoverPlaceholder
                            title={review.Book.title}
                            variant="amber"
                            className="p-2"
                        />
                    )}
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <CardTitle
                                className="line-clamp-2 text-base font-semibold leading-tight text-slate-900 group-hover:text-slate-700 transition-colors">
                                {review.Book.title}
                            </CardTitle>
                            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
                                <span>{formatReviewDate(review.createdAt)}</span>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            {/* Rating - simpler */}
                            <div
                                className="flex items-center gap-1 rounded border border-amber-200/60 bg-amber-50/50 px-2 py-1">
                                <Star className="size-3 fill-amber-500 text-amber-500"/>
                                <span className="text-xs font-semibold text-amber-700">{review.rating}</span>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 bg-white/80 p-0 shadow-sm hover:bg-white border border-slate-200/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                onClick={() => openBookModal(review.Book as BookType)}
                            >
                                <Info className="size-3.5 text-slate-600"/>
                                <span className="sr-only">Détails</span>
                            </Button>
                        </div>
                    </div>

                    {/* Review Content - cleaner */}
                    <CardContent className="p-0">
                        {review.feedback ? (
                            <div className="rounded border border-slate-100 bg-slate-50/50 p-2.5">
                                <p className="text-xs leading-relaxed text-slate-700">
                                    {review.feedback}
                                </p>
                            </div>
                        ) : (
                            <p className="text-xs italic text-slate-400">Pas de commentaire</p>
                        )}
                    </CardContent>
                </div>
            </div>
        </Card>
    );
};

export default ReviewCard;
