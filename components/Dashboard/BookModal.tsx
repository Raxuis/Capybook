"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Book as BookIcon, Heart, Trash2, BookOpen, Globe, Loader2} from "lucide-react";
import Image from "next/image";
import {Book} from "@/hooks/useBooks";
import {formatList} from "@/utils/formatList";
import {MoreInfoBook} from "@/components/Dashboard/DashboardContent";
import {useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";

interface BookModalProps {
    book: MoreInfoBook | null;
    isOpen: boolean;
    onClose: () => void;
    isInLibrary: (key: string) => boolean | undefined;
    isInWishlist: (key: string) => boolean | undefined;
    toggleLibrary: (book: Book) => Promise<void>;
    toggleWishlist: (book: Book) => Promise<void>;
    isLoading?: boolean;
}

const BookModal = ({
                       book,
                       isOpen,
                       onClose,
                       isInLibrary,
                       isInWishlist,
                       toggleLibrary,
                       toggleWishlist,
                       isLoading = false,
                   }: BookModalProps) => {

    const [loadingLibrary, setLoadingLibrary] = useState(false);
    const [loadingWishlist, setLoadingWishlist] = useState(false);

    if (!isOpen) return null;

    const handleToggleLibrary = async () => {
        if (!book) return;
        setLoadingLibrary(true);
        try {
            await toggleLibrary(book);
        } catch (error) {
            console.error("Error toggling library status:", error);
        } finally {
            setLoadingLibrary(false);
        }
    };

    const handleToggleWishlist = async () => {
        if (!book) return;
        setLoadingWishlist(true);
        try {
            await toggleWishlist(book);
        } catch (error) {
            console.error("Error toggling wishlist status:", error);
        } finally {
            setLoadingWishlist(false);
        }
    };

    const inLibrary = book ? isInLibrary(book.key) : false;
    const inWishlist = book ? isInWishlist(book.key) : false;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
                <DialogHeader>
                    {/*
                    DialogTitle to avoid error :
                    - with DialogContent missing DialogTitle
                    */}
                    {isLoading ? (
                        <DialogTitle>
                            <Skeleton className="h-7 w-3/4 mb-2"/>
                            <Skeleton className="h-4 w-full mb-1"/>
                            <Skeleton className="h-4 w-2/3"/>
                        </DialogTitle>
                    ) : (
                        <>
                            <DialogTitle
                                className="text-xl font-bold pr-8">{book?.title || "Détails du livre"}</DialogTitle>
                            {book?.description && (
                                <DialogDescription className="max-h-32 overflow-y-auto text-muted-foreground">
                                    <span>{book.description}</span>
                                </DialogDescription>
                            )}
                        </>
                    )}
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Image/Couverture */}
                    <div className="aspect-[2/3] relative bg-gray-100 rounded-md overflow-hidden">
                        {isLoading ? (
                            <Skeleton className="w-full h-full"/>
                        ) : book?.cover ? (
                            <Image
                                src={book.cover}
                                alt={book.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 200px"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="h-16 w-16 text-gray-300"/>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2 space-y-4">
                        {/* Auteurs */}
                        {isLoading ? (
                            <div>
                                <Skeleton className="h-4 w-24 mb-2"/>
                                <Skeleton className="h-5 w-3/4"/>
                            </div>
                        ) : book?.authors && book.authors.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Auteur(s)</h3>
                                <p>{formatList(book.authors)}</p>
                            </div>
                        )}

                        {/* Genres/Sujets */}
                        {isLoading ? (
                            <div>
                                <Skeleton className="h-4 w-24 mb-2"/>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    <Skeleton className="h-6 w-16 rounded-full"/>
                                    <Skeleton className="h-6 w-20 rounded-full"/>
                                    <Skeleton className="h-6 w-24 rounded-full"/>
                                </div>
                            </div>
                        ) : book?.subjects && book.subjects.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                                    <Globe className="h-4 w-4 mr-1"/>
                                    Genres(s)
                                </h3>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {book.subjects.slice(0, 5).map((subject, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs">
                                            {subject}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Statut */}
                        {isLoading ? (
                            <div>
                                <Skeleton className="h-4 w-24 mb-2"/>
                                <Skeleton className="h-6 w-40 rounded-full"/>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">Statut du livre</h3>
                                <div className="flex flex-wrap gap-2">
                                    {inLibrary && (
                                        <Badge variant="outline"
                                               className="bg-primary/10 text-primary flex items-center gap-1">
                                            <BookIcon className="h-3 w-3"/>
                                            Dans ma bibliothèque
                                        </Badge>
                                    )}
                                    {inWishlist && (
                                        <Badge variant="outline"
                                               className="bg-rose-50 text-rose-600 flex items-center gap-1">
                                            <Heart className="h-3 w-3"/>
                                            Dans ma wishlist
                                        </Badge>
                                    )}
                                    {!inLibrary && !inWishlist && (
                                        <Badge variant="outline" className="text-gray-500">
                                            Non ajouté
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                    {isLoading ? (
                        <>
                            <Skeleton className="h-10 w-full sm:w-40 rounded-md"/>
                            <Skeleton className="h-10 w-full sm:w-40 rounded-md"/>
                        </>
                    ) : (
                        <>
                            {inLibrary && (
                                <Button
                                    variant="destructive"
                                    className="w-full sm:w-auto"
                                    onClick={handleToggleLibrary}
                                    disabled={loadingLibrary || loadingWishlist}
                                >
                                    {loadingLibrary ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                                    ) : (
                                        <Trash2 className="h-4 w-4 mr-2"/>
                                    )}
                                    Retirer de ma bibliothèque
                                </Button>
                            )}
                            {inWishlist && (
                                <Button
                                    variant="destructive"
                                    className="w-full sm:w-auto"
                                    onClick={handleToggleWishlist}
                                    disabled={loadingLibrary || loadingWishlist}
                                >
                                    {loadingWishlist ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                                    ) : (
                                        <Trash2 className="h-4 w-4 mr-2"/>
                                    )}
                                    Retirer de ma wishlist
                                </Button>
                            )}
                            {!inLibrary && (
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto hover:bg-green-300"
                                    onClick={handleToggleLibrary}
                                    disabled={loadingLibrary || loadingWishlist}
                                >
                                    {loadingLibrary ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                                    ) : (
                                        <BookIcon className="h-4 w-4 mr-2"/>
                                    )}
                                    Ajouter à ma bibliothèque
                                </Button>
                            )}
                            {!inWishlist && (
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto hover:bg-amber-300"
                                    onClick={handleToggleWishlist}
                                    disabled={loadingLibrary || loadingWishlist}
                                >
                                    {loadingWishlist ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                                    ) : (
                                        <Heart className="h-4 w-4 mr-2"/>
                                    )}
                                    Ajouter à ma wishlist
                                </Button>
                            )}
                        </>
                    )}
                    <Button
                        variant="outline"
                        className="bg-gray-100 hover:bg-gray-200 w-full sm:w-auto"
                        onClick={onClose}
                        disabled={loadingLibrary || loadingWishlist}
                    >
                        Fermer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default BookModal;