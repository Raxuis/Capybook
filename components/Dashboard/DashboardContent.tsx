'use client';

import {useState} from "react";
import {useUser} from "@/hooks/useUser";
import DashboardBadge from "@/components/Dashboard/DashboardBadge";
import {Book, Star, Loader2, AlertCircle, Library, BookOpen, Heart, Info} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {formatList} from "@/utils/formatList";
import {Book as BookType, useBooks} from "@/hooks/useBooks";
import {Button} from "@/components/ui/button";
import axios from "axios";
import BookModal from "@/components/Dashboard/BookModal";

interface DashboardContentProps {
    userId?: string;
}

export type MoreInfoBook = BookType & {
    description?: string;
    subjects: string[];
    cover?: string;
}

export default function DashboardContent({userId}: DashboardContentProps) {
    const {user, isError, isValidating, isLoading} = useUser(userId);
    const [selectedBook, setSelectedBook] = useState<MoreInfoBook | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {isInLibrary, isInWishlist, toggleLibrary, toggleWishlist} = useBooks(undefined, userId);

    if (isLoading || isValidating) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2"/>
                <p className="text-muted-foreground">Chargement des données...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <AlertCircle className="h-8 w-8 text-destructive mb-2"/>
                <p className="font-medium">Erreur lors du chargement des données</p>
                <p className="text-muted-foreground mt-1">Veuillez réessayer ultérieurement</p>
            </div>
        );
    }

    if (!user) return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <AlertCircle className="h-8 w-8 text-amber-500 mb-2"/>
            <p className="font-medium">Utilisateur non trouvé</p>
        </div>
    );

    const hasBooks = user.UserBook.length > 0;
    const hasReviews = user.BookReview.length > 0;
    const hasWishlist = user.UserBookWishlist.length > 0;
    const userInitials = user.username.slice(0, 2).toUpperCase();

    const openBookModal = async (book: BookType) => {
        try {
            const bookInfos = await axios.get(`/api/book?bookKey=${book.key}`).then(res => res.data);
            if (!bookInfos) return;
            const bookForModal = {
                ...book,
                description: bookInfos.description.value,
                subjects: bookInfos.subjects,
            };
            console.log(bookForModal);
            setSelectedBook(bookForModal);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Erreur lors du chargement du livre :", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            {/* Header Section */}
            <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">{userInitials}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-2xl font-bold">Bonjour {user.username}</h1>
                    <p className="text-muted-foreground">Bienvenue sur votre tableau de bord</p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DashboardBadge
                    type="userBook"
                    className="flex items-center p-4 h-full transition-all hover:shadow-md"
                >
                    <div className="flex items-center space-x-4 w-full">
                        <div className="flex items-center justify-center bg-primary/10 p-3 rounded-full">
                            <Library className="h-6 w-6 text-primary"/>
                        </div>
                        <div>
                            <p className="font-medium">Ma bibliothèque</p>
                            <p className="text-xl font-bold">
                                {user.UserBook.length} {user.UserBook.length <= 1 ? 'livre' : 'livres'}
                            </p>
                        </div>
                    </div>
                </DashboardBadge>

                <DashboardBadge
                    type="userBookWishlist"
                    className="flex items-center p-4 h-full transition-all hover:shadow-md"
                >
                    <div className="flex items-center space-x-4 w-full">
                        <div className="flex items-center justify-center bg-rose-100 p-3 rounded-full">
                            <Heart className="h-6 w-6 text-rose-500"/>
                        </div>
                        <div>
                            <p className="font-medium">Ma wishlist</p>
                            <p className="text-xl font-bold">
                                {user.UserBookWishlist.length} {user.UserBookWishlist.length <= 1 ? 'livre' : 'livres'}
                            </p>
                        </div>
                    </div>
                </DashboardBadge>

                <DashboardBadge
                    type="bookReview"
                    className="flex items-center p-4 h-full transition-all hover:shadow-md"
                >
                    <div className="flex items-center space-x-4 w-full">
                        <div className="flex items-center justify-center bg-primary/10 p-3 rounded-full">
                            <Star className="h-6 w-6 text-primary"/>
                        </div>
                        <div>
                            <p className="font-medium">Mes avis</p>
                            <p className="text-xl font-bold">
                                {user.BookReview.length} {user.BookReview.length <= 1 ? 'avis' : 'avis'}
                            </p>
                        </div>
                    </div>
                </DashboardBadge>
            </div>

            {/* Main Content */}
            <Tabs defaultValue={hasBooks ? "library" : hasWishlist ? "wishlist" : "library"} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="library" disabled={!hasBooks} className="flex items-center space-x-2">
                        <Book className="h-4 w-4"/>
                        <span>Ma bibliothèque</span>
                    </TabsTrigger>
                    <TabsTrigger value="wishlist" disabled={!hasWishlist} className="flex items-center space-x-2">
                        <Heart className="h-4 w-4"/>
                        <span>Ma wishlist</span>
                    </TabsTrigger>
                    <TabsTrigger value="reviews" disabled={!hasReviews} className="flex items-center space-x-2">
                        <Star className="h-4 w-4"/>
                        <span>Mes avis</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="library" className="space-y-4">
                    {hasBooks ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user.UserBook.map(userBook => (
                                <Card key={userBook.id}
                                      className="overflow-hidden transition-all hover:shadow-md group">
                                    <CardHeader
                                        className="p-4 pb-2 bg-primary/5 flex flex-row items-center justify-between space-y-0">
                                        <CardTitle
                                            className="text-lg font-medium line-clamp-1">{userBook.Book.title}</CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 p-0 pt-0.5 hover:bg-transparent"
                                            onClick={() => openBookModal(userBook.Book as BookType)}
                                        >
                                            <Info className="h-4 w-4"/>
                                            <span className="sr-only">Détails</span>
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <BookOpen className="h-4 w-4 mr-2 text-muted-foreground"/>
                                            <span className="text-sm text-muted-foreground">
                                                {userBook.Book.authors || "Auteur inconnu"}
                                            </span>
                                        </div>
                                        <Badge
                                            className="text-xs bg-primary/10 group-hover:bg-blue-100 cursor-default text-primary rounded-full">
                                            {userBook.progress}% lu
                                        </Badge>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <Book className="h-12 w-12 text-muted-foreground mb-2"/>
                                <p className="text-muted-foreground">Votre bibliothèque est vide</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="wishlist" className="space-y-4">
                    {hasWishlist ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user.UserBookWishlist.map(wishlistItem => (
                                <Card key={wishlistItem.id}
                                      className="overflow-hidden transition-all hover:shadow-md group border-rose-100 hover:border-rose-200">
                                    <CardHeader
                                        className="p-4 pb-2 bg-rose-50 flex flex-row items-center justify-between space-y-0">
                                        <CardTitle
                                            className="text-lg font-medium line-clamp-1">{wishlistItem.Book.title}</CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 p-0 pt-0.5"
                                            onClick={() => openBookModal(wishlistItem.Book as BookType)}
                                        >
                                            <Info className="h-4 w-4"/>
                                            <span className="sr-only">Détails</span>
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2 flex items-center justify-between space-x-2">
                                        <div className="flex items-center">
                                            <BookOpen className="h-4 w-4 mr-2 text-muted-foreground"/>
                                            <span className="text-sm text-muted-foreground">
                                                {formatList(wishlistItem.Book.authors) || "Auteur(s) inconnu(s)"}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Badge
                                                className="text-xs bg-rose-100 group-hover:bg-rose-200 cursor-default text-rose-700 rounded-full">
                                                Souhaité depuis
                                                le {new Date(wishlistItem.createdAt).toLocaleDateString()}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <Heart className="h-12 w-12 text-rose-300 mb-2"/>
                                <p className="text-muted-foreground">Votre wishlist est vide</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                    {hasReviews ? (
                        <div className="space-y-4">
                            {user.BookReview.map(review => (
                                <Card key={review.id} className="overflow-hidden">
                                    <CardHeader
                                        className="p-4 pb-2 flex flex-row items-center justify-between bg-primary/5 space-y-0">
                                        <CardTitle className="text-lg font-medium">{review.Book.title}</CardTitle>
                                        <div className="flex items-center">
                                            <div className="flex items-center bg-white px-2 py-1 rounded-full mr-2">
                                                <Star className="h-3 w-3 text-amber-500 mr-1 inline-block"/>
                                                <span className="text-sm font-bold">{review.rating}/5</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 p-0 pt-0.5"
                                                onClick={() => openBookModal(review.Book as BookType)}
                                            >
                                                <Info className="h-4 w-4"/>
                                                <span className="sr-only">Détails</span>
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        {review.review ? (
                                            <p className="text-muted-foreground">{review.review}</p>
                                        ) : (
                                            <p className="text-muted-foreground italic">Pas de commentaire</p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <Star className="h-12 w-12 text-muted-foreground mb-2"/>
                                <p className="text-muted-foreground">Vous n&#39;avez pas encore écrit d&#39;avis</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            {/* Modal pour les détails du livre */}
            <BookModal
                book={selectedBook}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isInLibrary={isInLibrary}
                isInWishlist={isInWishlist}
                toggleLibrary={toggleLibrary}
                toggleWishlist={toggleWishlist}
            />
        </div>
    );
}