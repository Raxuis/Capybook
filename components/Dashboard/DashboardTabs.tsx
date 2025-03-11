import React, { useMemo } from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Book, BookOpen, Heart, Info, Star} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Book as BookType} from "@/hooks/useBooks";
import {Badge} from "@/components/ui/badge";
import ProgressTracker from "@/components/Dashboard/Progress/ProgressTracker";
import {formatList} from "@/utils/formatList";
import {UserWithRelations} from "@/hooks/useUser";

type Props = {
    user: UserWithRelations;
    openBookModal: (book: BookType) => void;
}

const DashboardTabs = ({
                           user,
                           openBookModal
                       }: Props) => {

    const booksStatus = useMemo(() => {
        return {
            hasBooks: user.UserBook.length > 0,
            hasWishlist: user.UserBookWishlist.length > 0,
            hasReviews: user.BookReview.length > 0
        }
    }, [user.UserBook, user.UserBookWishlist, user.BookReview]);


    return (
        <Tabs defaultValue={booksStatus.hasBooks ? "library" : booksStatus.hasWishlist ? "wishlist" : "library"} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="library" disabled={!booksStatus.hasBooks} className="flex items-center space-x-2">
                    <Book className="h-4 w-4"/>
                    <span>Ma bibliothèque</span>
                </TabsTrigger>
                <TabsTrigger value="wishlist" disabled={!booksStatus.hasWishlist} className="flex items-center space-x-2">
                    <Heart className="h-4 w-4"/>
                    <span>Ma wishlist</span>
                </TabsTrigger>
                <TabsTrigger value="reviews" disabled={!booksStatus.hasReviews} className="flex items-center space-x-2">
                    <Star className="h-4 w-4"/>
                    <span>Mes avis</span>
                </TabsTrigger>
            </TabsList>

            <TabsContent value="library" className="space-y-4">
                {booksStatus.hasBooks ? (
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
                                <CardContent className="p-4 pt-3 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <BookOpen className="h-4 w-4 mr-2 text-muted-foreground"/>
                                            <span className="text-sm text-muted-foreground">
                                                    {userBook.Book.authors || "Auteur inconnu"}
                                                </span>
                                        </div>
                                        {
                                            userBook.progress === 100 && (
                                                <Badge
                                                    variant="outline"
                                                    className="bg-secondary/10 text-secondary cursor-pointer hover:bg-secondary/20 transition-colors"
                                                >
                                                    Livre fini
                                                </Badge>
                                            )
                                        }
                                    </div>

                                    {
                                        userBook.isCurrentBook && (
                                            <ProgressTracker
                                                bookId={userBook.Book.id}
                                                initialProgress={userBook.progress || 0}
                                                userId={user.id}
                                            />
                                        )
                                    }
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
                {booksStatus.hasWishlist ? (
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
                                        className="h-8 w-8 p-0 pt-0.5 hover:bg-transparent"
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
                {booksStatus.hasReviews ? (
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
                                            className="h-8 w-8 p-0 pt-0.5 hover:bg-transparent"
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
    );
};

export default DashboardTabs;
