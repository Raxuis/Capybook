import {cn} from "@/lib/utils";
import {Book} from "@/hooks/useBooks";
import {Badge} from "@/components/ui/badge";
import {BookOpen, Plus, X, Library, Star, Check} from "lucide-react";
import {FcLikePlaceholder, FcLike} from "react-icons/fc";
import SimplifiedTooltip from "@/components/SimplifiedTooltip";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {formatList} from "@/utils/formatList";
import {useToast} from "@/hooks/use-toast";
import {useState} from "react";

type BookCardProps = {
    book: Book;
    className?: string;
    toggleLibrary: (book: Book) => void;
    toggleWishlist: (book: Book) => void;
    isInLibrary: boolean;
    isInWishlist: boolean;
};

type ClickType = "library" | "wishlist";

export default function BookCard({
                                     book,
                                     className,
                                     toggleLibrary,
                                     toggleWishlist,
                                     isInLibrary,
                                     isInWishlist,
                                 }: BookCardProps) {
    const {toast} = useToast();
    const [showAnimation, setShowAnimation] = useState<ClickType | null>(null);

    const handleClick = (click: ClickType) => {
        setShowAnimation(click);

        setTimeout(() => setShowAnimation(null), 1000);

        switch (click) {
            case "library":
                toggleLibrary(book);
                toast({
                    title: `${isInLibrary ? "Retiré de" : "Ajouté à"} votre bibliothèque`,
                    description: (
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                                {book.cover_i ? (
                                    <Image
                                        src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                                        alt={book.title}
                                        width={40}
                                        height={40}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                                        <BookOpen className="h-6 w-6 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="font-medium line-clamp-1">{book.title}</p>
                                <p className="text-sm text-gray-500 line-clamp-1">
                                    {book.author_name ? formatList(book.author_name.slice(0, 1)) : "Auteur inconnu"}
                                </p>
                            </div>
                        </div>
                    ),
                    variant: isInLibrary ? "default" : "success",
                    icon: isInLibrary ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />,
                    duration: 3000,
                });
                break;
            case "wishlist":
                toggleWishlist(book);
                toast({
                    title: `${isInWishlist ? "Retiré des" : "Ajouté aux"} favoris`,
                    description: (
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                                {book.cover_i ? (
                                    <Image
                                        src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                                        alt={book.title}
                                        width={40}
                                        height={40}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                                        <BookOpen className="h-6 w-6 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="font-medium line-clamp-1">{book.title}</p>
                                <p className="text-sm text-gray-500 line-clamp-1">
                                    {book.author_name ? formatList(book.author_name.slice(0, 1)) : "Auteur inconnu"}
                                </p>
                            </div>
                        </div>
                    ),
                    variant: isInWishlist ? "default" : "success",
                    icon: isInWishlist ? <X className="h-4 w-4" /> : <Star className="h-4 w-4 fill-current" />,
                    duration: 3000,
                });
                break;
            default:
                break;
        }
    };

    return (
        <div
            className={cn("flex flex-col h-full border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow", className)}>
            <div className="relative">
                {book.cover_i ? (
                    <div className="aspect-[2/3] w-full bg-gray-100 relative">
                        <Image
                            src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                            alt={book.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />

                        {/* Animation overlay pour l'ajout à la bibliothèque */}
                        {showAnimation === 'library' && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center animate-fadein">
                                <div className={`text-white flex items-center gap-2 text-lg font-medium ${isInLibrary ? 'animate-fadeout' : 'animate-scale-in'}`}>
                                    {isInLibrary ? (
                                        <>
                                            <X className="h-6 w-6" /> Retiré
                                        </>
                                    ) : (
                                        <>
                                            <Library className="h-6 w-6" /> Bibliothèque
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Animation overlay pour l'ajout aux favoris */}
                        {showAnimation === 'wishlist' && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center animate-fadein">
                                <div className={`text-white flex items-center gap-2 text-lg font-medium ${isInWishlist ? 'animate-fadeout' : 'animate-scale-in'}`}>
                                    {isInWishlist ? (
                                        <>
                                            <X className="h-6 w-6" /> Retiré
                                        </>
                                    ) : (
                                        <>
                                            <Star className="h-6 w-6 fill-current" /> Favori
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="aspect-[2/3] w-full bg-gray-100 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-gray-300"/>
                    </div>
                )}

                <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <SimplifiedTooltip
                        tooltipContent={isInLibrary ? "Retirer de ma bibliothèque" : "Ajouter à ma bibliothèque"}
                        asChild>
                        <Button
                            onClick={() => handleClick("library")}
                            className={cn(
                                "h-8 w-8 flex items-center justify-center rounded-full",
                                isInLibrary
                                    ? "bg-primary text-white hover:bg-primary/90"
                                    : "bg-white text-gray-700 hover:bg-gray-100 border"
                            )}
                        >
                            {isInLibrary ? <X size={16}/> : <Plus size={16}/>}
                        </Button>
                    </SimplifiedTooltip>

                    <SimplifiedTooltip tooltipContent={isInWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
                                       asChild>
                        <Button
                            onClick={() => handleClick("wishlist")}
                            className="h-8 w-8 flex items-center justify-center bg-white rounded-full border hover:bg-gray-100"
                        >
                            {isInWishlist ? <FcLike size={18}/> : <FcLikePlaceholder size={18}/>}
                        </Button>
                    </SimplifiedTooltip>
                </div>
            </div>

            <div className="flex flex-col flex-grow p-4">
                <div className="mb-auto">
                    <h3 className="font-semibold text-lg line-clamp-2 mb-1">{book.title}</h3>
                    {book.first_publish_year && (
                        <Badge variant="outline" className="mb-3">
                            {book.first_publish_year}
                        </Badge>
                    )}
                </div>

                <div className="mt-4 space-y-2 text-sm">
                    <div>
                        <p className="text-gray-500 font-medium mb-1">Auteur(s) :</p>
                        <p className="line-clamp-2">{formatList(book.author_name)}</p>
                    </div>

                    {book.language && book.language.length > 0 && (
                        <div>
                            <p className="text-gray-500 font-medium mb-1">Langues :</p>
                            <div className="flex flex-wrap gap-1">
                                {book.language.slice(0, 3).map((lang, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                        {lang}
                                    </Badge>
                                ))}
                                {book.language.length > 3 && (
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
}