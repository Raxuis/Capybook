import {cn} from "@/lib/utils";
import {useBooks} from "@/hooks/useBooks";
import {Badge} from "@/components/ui/badge";
import {BookOpen, Plus, X, Library, Star, Check} from "lucide-react";
import {FcLikePlaceholder, FcLike, FcComments} from "react-icons/fc";
import SimplifiedTooltip from "@/components/SimplifiedTooltip";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {formatList} from "@/utils/format";
import {useToast} from "@/hooks/use-toast";
import {memo, useCallback, useMemo, useState} from "react";
import {useReviewModalStore} from "@/store/reviewModalStore";
import {Book, MoreInfoBook} from "@/types";

type BookCardProps = {
    book: Book;
    className?: string;
    debouncedBookName: string | null;
};

type ClickType = "library" | "wishlist" | "review";

const BookCard = memo(({
                           book,
                           className,
                           debouncedBookName,
                       }: BookCardProps) => {
    const {
        toggleLibrary,
        toggleWishlist,
        isInLibrary,
        isInWishlist,
        isBookFinished,
        isReviewed
    } = useBooks(debouncedBookName);

    const {setBookToReview} = useReviewModalStore();

    const {toast} = useToast();
    const [showAnimation, setShowAnimation] = useState<ClickType | null>(null);

    const bookIsInLibrary = useMemo(() => isInLibrary(book.key), [book.key, isInLibrary]);
    const bookIsInWishlist = useMemo(() => isInWishlist(book.key), [book.key, isInWishlist]);
    const bookIsReviewed = useMemo(() => isReviewed(book.key), [book.key, isReviewed]);
    const bookIsFinished = useMemo(() => isBookFinished(book.key), [book, isBookFinished]);


    const formattedAuthors = useMemo(() => {
        return book.author_name ? formatList(book.author_name.slice(0, 1)) : "Auteur inconnu";
    }, [book.author_name]);

    const formattedLanguages = useMemo(() => {
        const languages = book.language ?? [];
        if (languages.length === 0) return null;

        return languages.slice(0, 3).map((lang, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
                {lang}
            </Badge>
        ));
    }, [book.language]);

    const bookCoverUrl = useMemo(() =>
            book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
        [book.cover_i]
    );

    const handleLibraryClick = useCallback(() => {
        setShowAnimation("library");
        setTimeout(() => setShowAnimation(null), 1000);

        toggleLibrary(book);
        toast({
            title: `${bookIsInLibrary ? "Retiré de" : "Ajouté à"} votre bibliothèque`,
            description: (
                <div className="flex items-center gap-2">
                    <div className="size-10 shrink-0 overflow-hidden rounded-md">
                        {book.cover_i ? (
                            <Image
                                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                                alt={book.title}
                                width={40}
                                height={40}
                                className="size-full object-cover"
                            />
                        ) : (
                            <div className="flex size-full items-center justify-center bg-gray-100">
                                <BookOpen className="size-6 text-gray-400"/>
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="line-clamp-1 font-medium">{book.title}</p>
                        <p className="line-clamp-1 text-sm text-gray-500">
                            {formattedAuthors}
                        </p>
                    </div>
                </div>
            ),
            variant: bookIsInLibrary ? "default" : "success",
            icon: bookIsInLibrary ? <X className="size-4"/> : <Check className="size-4"/>,
            duration: 3000,
        });
    }, [book, bookIsInLibrary, formattedAuthors, toast, toggleLibrary]);

    const handleWishlistClick = useCallback(() => {
        setShowAnimation("wishlist");
        setTimeout(() => setShowAnimation(null), 1000);

        toggleWishlist(book);
        toast({
            title: `${bookIsInWishlist ? "Retiré des" : "Ajouté aux"} favoris`,
            description: (
                <div className="flex items-center gap-2">
                    <div className="size-10 shrink-0 overflow-hidden rounded-md">
                        {book.cover_i ? (
                            <Image
                                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                                alt={book.title}
                                width={40}
                                height={40}
                                className="size-full object-cover"
                            />
                        ) : (
                            <div className="flex size-full items-center justify-center bg-gray-100">
                                <BookOpen className="size-6 text-gray-400"/>
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="line-clamp-1 font-medium">{book.title}</p>
                        <p className="line-clamp-1 text-sm text-gray-500">{formattedAuthors}</p>
                    </div>
                </div>
            ),
            variant: bookIsInWishlist ? "default" : "success",
            icon: bookIsInWishlist ? <X className="size-4"/> : <Star className="size-4 fill-current"/>,
            duration: 3000,
        });
    }, [book, bookIsInWishlist, formattedAuthors, toast, toggleWishlist]);

    const handleReviewClick = useCallback(() => {
        setShowAnimation("review");
        setTimeout(() => setShowAnimation(null), 1000);
        setBookToReview(book as MoreInfoBook);
    }, [book, setBookToReview]);

    return (
        <div
            className={cn("flex flex-col h-full border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow", className)}>
            <div className="relative">
                {book.cover_i ? (
                    <div className="relative aspect-[2/3] w-full bg-gray-100">
                        <Image
                            src={bookCoverUrl ?? ""}
                            alt={book.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            loading="lazy"
                        />

                        {/* Animation overlay pour l'ajout à la bibliothèque */}
                        {showAnimation === 'library' && (
                            <div
                                className="animate-fadein absolute inset-0 flex items-center justify-center bg-black/30">
                                <div
                                    className={`flex items-center gap-2 text-lg font-medium text-white ${bookIsInLibrary ? 'animate-fadeout' : 'animate-scale-in'}`}>
                                    {bookIsInLibrary ? (
                                        <>
                                            <X className="size-6"/> Retiré
                                        </>
                                    ) : (
                                        <>
                                            <Library className="size-6"/> Bibliothèque
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Animation overlay pour l'ajout aux favoris */}
                        {showAnimation === 'wishlist' && (
                            <div
                                className="animate-fadein absolute inset-0 flex items-center justify-center bg-black/30">
                                <div
                                    className={`flex items-center gap-2 text-lg font-medium text-white ${bookIsInWishlist ? 'animate-fadeout' : 'animate-scale-in'}`}>
                                    {bookIsInWishlist ? (
                                        <>
                                            <X className="size-6"/> Retiré
                                        </>
                                    ) : (
                                        <>
                                            <Star className="size-6 fill-current"/> Favori
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex aspect-[2/3] w-full items-center justify-center bg-gray-100">
                        <BookOpen className="size-16 text-gray-300"/>
                    </div>
                )}

                <div className="absolute right-2 top-2 flex flex-col gap-2">
                    <SimplifiedTooltip
                        tooltipContent={bookIsInLibrary ? "Retirer de ma bibliothèque" : "Ajouter à ma bibliothèque"}
                        asChild>
                        <Button
                            onClick={handleLibraryClick}
                            className={cn(
                                "h-8 w-8 flex items-center justify-center rounded-full",
                                bookIsInLibrary
                                    ? "bg-primary text-white hover:bg-primary/90"
                                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                            )}
                        >
                            {bookIsInLibrary ? <X size={16}/> : <Plus size={16}/>}
                        </Button>
                    </SimplifiedTooltip>

                    {
                        !bookIsInLibrary && (
                            <SimplifiedTooltip
                                tooltipContent={bookIsInWishlist ? "Retirer de ma wishlist" : "Ajouter à ma wishlist"}
                                asChild>
                                <Button
                                    onClick={handleWishlistClick}
                                    className="flex size-8 items-center justify-center rounded-full border bg-white hover:bg-gray-100"
                                >
                                    {bookIsInWishlist ? <FcLike size={18}/> : <FcLikePlaceholder size={18}/>}
                                </Button>
                            </SimplifiedTooltip>
                        )
                    }


                    {
                        (bookIsInLibrary && !bookIsReviewed && bookIsFinished) && (
                            <SimplifiedTooltip
                                tooltipContent={"Ajouter un avis"}
                                asChild>
                                <Button
                                    onClick={handleReviewClick}
                                    className="flex size-8 items-center justify-center rounded-full border bg-white hover:bg-gray-100"
                                >
                                    <FcComments size={18} className="opacity-40"/>
                                </Button>
                            </SimplifiedTooltip>
                        )
                    }
                </div>
            </div>

            <div className="flex grow flex-col p-4">
                <div className="mb-auto">
                    <h3 className="mb-1 line-clamp-2 text-lg font-semibold">{book.title}</h3>
                    {book.first_publish_year && (
                        <Badge variant="outline" className="mb-3">
                            {book.first_publish_year}
                        </Badge>
                    )}
                </div>

                <div className="mt-4 space-y-2 text-sm">
                    <div>
                        <p className="mb-1 font-medium text-gray-500">Auteur(s) :</p>
                        <p className="line-clamp-2">{formatList(book.author_name)}</p>
                    </div>

                    {formattedLanguages && (
                        <div>
                            <p className="mb-1 font-medium text-gray-500">Langues :</p>
                            <div className="flex flex-wrap gap-1">
                                {formattedLanguages.map((formattedLanguage) => (
                                    formattedLanguage
                                ))}
                                {book.language && book.language.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                        +{book.language.length - 3}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
})
BookCard.displayName = "BookCard";

export default BookCard;