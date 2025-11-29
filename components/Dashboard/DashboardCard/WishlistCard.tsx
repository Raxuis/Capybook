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
        <Card className="group relative overflow-hidden border border-rose-200/60 bg-white transition-all duration-200 hover:border-rose-300 hover:shadow-md hover:-translate-y-0.5 h-full flex flex-col">
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
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
                        className="h-7 w-7 bg-white/95 backdrop-blur-sm p-0 shadow-sm hover:bg-white border border-slate-200/50"
                        onClick={() => openBookModal(wishlistItem.Book as BookType)}
                    >
                        <Info className="size-3.5 text-slate-600"/>
                        <span className="sr-only">Détails</span>
                    </Button>
                </div>
            </div>

            <CardHeader className="pb-2.5 pt-3.5 px-4">
                <CardTitle className="line-clamp-2 text-base font-semibold leading-tight text-slate-900 group-hover:text-slate-700 transition-colors">
                    {wishlistItem.Book.title}
                </CardTitle>

                <div className="flex items-start gap-1.5 pt-1.5 text-xs text-slate-500">
                    <BookOpen className="size-3 mt-0.5 shrink-0"/>
                    <span className="line-clamp-1">
                        {formatList(wishlistItem.Book.authors) || "Auteur(s) inconnu(s)"}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="pt-0 pb-4 px-4 mt-auto">
                <div className="flex items-center gap-1.5 rounded-md bg-rose-50/50 border border-rose-200/40 px-2.5 py-1.5">
                    <Heart className="size-3 fill-rose-400 text-rose-400" />
                    <span className="text-[10px] text-rose-700 font-medium">
                        Souhaité {formatDate(wishlistItem.createdAt)}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};

export default WishlistCard;
