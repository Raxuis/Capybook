import {BookOpen, Info, Heart} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Book as BookType} from "@/types";
import {formatList} from "@/lib/helpers/format";
import Image from "next/image";
import {cn} from "@/lib/utils";

type WishlistCardProps = {
    wishlistItem: {
        Book: BookType;
        createdAt: Date | string;
    };
    openBookModal: (book: BookType) => void;
};

/**
 * Safely formats a date to a localized date string
 * Handles both Date objects and date strings from JSON
 */
const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
        return 'Date invalide';
    }

    return dateObj.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const WishlistCard = ({wishlistItem, openBookModal}: WishlistCardProps) => {
    const bookCoverUrl = wishlistItem.Book.cover
        ? wishlistItem.Book.cover
        : wishlistItem.Book.cover_i
            ? `https://covers.openlibrary.org/b/id/${wishlistItem.Book.cover_i}-M.jpg`
            : null;

    return (
        <Card className="group relative overflow-hidden border-rose-100/60 bg-gradient-to-br from-rose-50/50 to-white transition-all duration-300 hover:border-rose-200 hover:shadow-xl h-full flex flex-col">
            {/* Decorative heart icon in corner */}
            <div className="absolute right-3 top-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Heart className="size-16 fill-rose-200 text-rose-200" />
            </div>

            {/* Book Cover Section */}
            <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-rose-100 to-rose-200">
                {bookCoverUrl ? (
                    <Image
                        src={bookCoverUrl}
                        alt={wishlistItem.Book.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <BookOpen className="size-16 text-rose-300" />
                    </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-rose-900/10 via-transparent to-transparent" />

                {/* Action button overlay */}
                <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="size-8 bg-white/90 backdrop-blur-sm p-0 shadow-md hover:bg-white hover:scale-110 transition-transform"
                        onClick={() => openBookModal(wishlistItem.Book as BookType)}
                    >
                        <Info className="size-4 text-slate-700"/>
                        <span className="sr-only">Détails</span>
                    </Button>
                </div>
            </div>

            <CardHeader className="pb-3 pt-4 relative">
                <CardTitle className="line-clamp-2 text-lg font-semibold leading-snug text-slate-900 group-hover:text-rose-700 transition-colors pr-8">
                    {wishlistItem.Book.title}
                </CardTitle>

                <div className="flex items-center gap-2 pt-2 text-sm text-slate-600">
                    <BookOpen className="size-3.5 shrink-0"/>
                    <span className="line-clamp-1 font-medium">
                        {formatList(wishlistItem.Book.authors) || "Auteur(s) inconnu(s)"}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="pt-0 pb-4 mt-auto">
                <Badge
                    className={cn(
                        "cursor-default rounded-full bg-rose-100/80 text-xs font-medium text-rose-700",
                        "border border-rose-200/50 shadow-sm",
                        "hover:bg-rose-100 transition-colors"
                    )}
                >
                    <Heart className="mr-1.5 size-3 fill-rose-500 text-rose-500" />
                    Souhaité le {formatDate(wishlistItem.createdAt)}
                </Badge>
            </CardContent>
        </Card>
    );
};

export default WishlistCard;
