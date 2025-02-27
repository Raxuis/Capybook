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
import {Book as BookIcon, Heart, Trash2, BookOpen, Globe} from "lucide-react";
import Image from "next/image";
import {Book} from "@/hooks/useBooks";
import {formatList} from "@/utils/formatList";
import {MoreInfoBook} from "@/components/Dashboard/DashboardContent";

interface BookModalProps {
    book: MoreInfoBook | null;
    isOpen: boolean;
    onClose: () => void;
    isInLibrary: (key: string) => boolean | undefined;
    isInWishlist: (key: string) => boolean | undefined;
    toggleLibrary: (book: Book) => Promise<void>;
    toggleWishlist: (book: Book) => Promise<void>;
}

const BookModal = ({
                       book,
                       isOpen,
                       onClose,
                       isInLibrary,
                       isInWishlist,
                       toggleLibrary,
                       toggleWishlist,
                   }: BookModalProps) => {
    if (!book) return null;

    const handleRemoveFromLibrary = async () => {
        await toggleLibrary(book);
    };

    const handleRemoveFromWishlist = async () => {
        await toggleWishlist(book);
    };

    const inLibrary = isInLibrary(book.key);
    const inWishlist = isInWishlist(book.key);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold pr-8">{book.title}</DialogTitle>
                    {book.description && (
                        <DialogDescription className="flex items-center text-muted-foreground">
                            <span>{book.description}</span>
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="aspect-[2/3] relative bg-gray-100 rounded-md overflow-hidden">
                        {book.cover ? (
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
                        {book.authors && book.authors.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Auteur(s)</h3>
                                <p>{formatList(book.authors)}</p>
                            </div>
                        )}

                        {book.subjects && book.subjects.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                                    <Globe className="h-4 w-4 mr-1"/>
                                    Genres(s)
                                </h3>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {book.subjects.map((subject, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs">
                                            {subject}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

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
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                    {inLibrary && (
                        <Button
                            variant="destructive"
                            className="w-full sm:w-auto"
                            onClick={handleRemoveFromLibrary}
                        >
                            <Trash2 className="h-4 w-4 mr-2"/>
                            Retirer de ma bibliothèque
                        </Button>
                    )}
                    {inWishlist && (
                        <Button
                            variant="destructive"
                            className="w-full sm:w-auto"
                            onClick={handleRemoveFromWishlist}
                        >
                            <Trash2 className="h-4 w-4 mr-2"/>
                            Retirer de ma wishlist
                        </Button>
                    )}
                    {!inLibrary && (
                        <Button
                            variant="default"
                            className="w-full sm:w-auto"
                            onClick={() => toggleLibrary(book)}
                        >
                            <BookIcon className="h-4 w-4 mr-2"/>
                            Ajouter à ma bibliothèque
                        </Button>
                    )}
                    {!inWishlist && (
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => toggleWishlist(book)}
                        >
                            <Heart className="h-4 w-4 mr-2"/>
                            Ajouter à ma wishlist
                        </Button>
                    )}
                    <Button
                        variant="secondary"
                        className="w-full sm:w-auto"
                        onClick={onClose}
                    >
                        Fermer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default BookModal;