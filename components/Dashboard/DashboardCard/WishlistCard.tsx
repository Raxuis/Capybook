import {BookOpen, Info, Heart} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Book as BookType} from "@/types";
import {formatList} from "@/lib/helpers/format";
import Image from "next/image";
import {BookCoverPlaceholder} from "@/components/common/BookCoverPlaceholder";

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
        <Card className="group relative flex h-full flex-col overflow-hidden border border-rose-200/60 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md">
            {/* Book Cover Section */}
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-50">
                {bookCoverUrl ? (
                    <>
                        <Image
                            src={bookCoverUrl}
                            alt={wishlistItem.Book.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                    </>
                ) : (
                    <BookCoverPlaceholder
                        title={wishlistItem.Book.title}
                        authors={wishlistItem.Book.authors}
                        variant="rose"
                    />
                )}

                {/* Action button - more subtle */}
                <div className="absolute right-3 top-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="size-7 border border-slate-200/50 bg-white/95 p-0 shadow-sm backdrop-blur-sm hover:bg-white"
                        onClick={() => openBookModal(wishlistItem.Book as BookType)}
                    >
                        <Info className="size-3.5 text-slate-600"/>
                        <span className="sr-only">Détails</span>
                    </Button>
                </div>
            </div>

            <CardHeader className="px-4 pb-2.5 pt-3.5">
                <CardTitle className="line-clamp-2 text-base font-semibold leading-tight text-slate-900 transition-colors group-hover:text-slate-700">
                    {wishlistItem.Book.title}
                </CardTitle>

                <div className="flex items-start gap-1.5 pt-1.5 text-xs text-slate-500">
                    <BookOpen className="mt-0.5 size-3 shrink-0"/>
                    <span className="line-clamp-1">
                        {formatList(wishlistItem.Book.authors) || "Auteur(s) inconnu(s)"}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="mt-auto px-4 pb-4 pt-0">
                <div className="flex items-center gap-1.5 rounded-md border border-rose-200/40 bg-rose-50/50 px-2.5 py-1.5">
                    <Heart className="size-3 fill-rose-400 text-rose-400" />
                    <span className="text-[10px] font-medium text-rose-700">
                        Souhaité {formatDate(wishlistItem.createdAt)}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};

export default WishlistCard;
