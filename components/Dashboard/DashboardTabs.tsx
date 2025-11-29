import React, {useMemo} from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Book, Heart, Star} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {Book as BookType} from "@/types";
import {PageNumberModal} from "@/components/Dashboard/Progress/EnterPageNumber";
import {useUser} from "@/hooks/useUser";
import LibraryCard from "@/components/Dashboard/DashboardCard/LibraryCard";
import WishlistCard from "@/components/Dashboard/DashboardCard/WishlistCard";
import ReviewCard from "@/components/Dashboard/DashboardCard/ReviewCard";
import {CardSkeleton} from "@/components/common";

type Props = {
    openBookModal: (book: BookType) => void;
}

const DashboardTabs = ({openBookModal}: Props) => {

    const {user, isLoading, isValidating} = useUser();

    const booksStatus = useMemo(() => {
        if (!user) return {
            hasBooks: false,
            hasWishlist: false,
            hasReviews: false
        };
        return {
            hasBooks: user.UserBook.length > 0,
            hasWishlist: user.UserBookWishlist.length > 0,
            hasReviews: user.BookReview.length > 0
        }
    }, [user?.UserBook, user?.UserBookWishlist, user?.BookReview]);

    const isUserLoading = isLoading || isValidating || !user;

    if (isUserLoading) {
        return (
            <div className="relative">
                <Tabs defaultValue="library" className="w-full">
                    <TabsList className="mb-6 grid w-full grid-cols-3">
                        <TabsTrigger value="library" className="flex items-center space-x-2">
                            <Book className="size-4"/>
                            <span>Ma bibliothèque</span>
                        </TabsTrigger>
                        <TabsTrigger value="wishlist" className="flex items-center space-x-2">
                            <Heart className="size-4"/>
                            <span>Ma wishlist</span>
                        </TabsTrigger>
                        <TabsTrigger value="reviews" className="flex items-center space-x-2">
                            <Star className="size-4"/>
                            <span>Mes avis</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="library" className="space-y-4">
                        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[...Array(6)].map((_, i) => (
                                <CardSkeleton key={i} variant="library" />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        );
    }


    return (
        <div className="relative">
            <Tabs defaultValue={booksStatus.hasBooks ? "library" : booksStatus.hasWishlist ? "wishlist" : "library"}
                  className="w-full">
                <TabsList className="mb-6 grid w-full grid-cols-3">
                    <TabsTrigger value="library" disabled={!booksStatus.hasBooks}
                                 className="flex items-center space-x-2">
                        <Book className="size-4"/>
                        <span>Ma bibliothèque</span>
                    </TabsTrigger>
                    <TabsTrigger value="wishlist" disabled={!booksStatus.hasWishlist}
                                 className="flex items-center space-x-2">
                        <Heart className="size-4"/>
                        <span>Ma wishlist</span>
                    </TabsTrigger>
                    <TabsTrigger value="reviews" disabled={!booksStatus.hasReviews}
                                 className="flex items-center space-x-2">
                        <Star className="size-4"/>
                        <span>Mes avis</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="library" className="space-y-4">
                    {booksStatus.hasBooks ? (
                        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {user.UserBook.map(userBook => (
                                <LibraryCard
                                    key={userBook.id}
                                    userBook={
                                        {
                                            ...userBook,
                                            Book: {
                                                ...userBook.Book,
                                                cover: userBook.Book.cover ?? undefined,
                                                numberOfPages: userBook.Book.numberOfPages ?? undefined,
                                            },
                                            progressType: userBook.progressType as "percentage" | "numberOfPages" ?? 'percentage',
                                        }
                                    }
                                    openBookModal={openBookModal}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <Book className="text-muted-foreground mb-2 size-12"/>
                                <p className="text-muted-foreground">Votre bibliothèque est vide</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="wishlist" className="space-y-4">
                    {booksStatus.hasWishlist ? (
                        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {user.UserBookWishlist.map(wishlistItem => (
                                <WishlistCard
                                    key={wishlistItem.id}
                                    wishlistItem={{
                                        ...wishlistItem,
                                        Book: {
                                            ...wishlistItem.Book,
                                            cover: wishlistItem.Book.cover ?? undefined,
                                            numberOfPages: wishlistItem.Book.numberOfPages ?? undefined,
                                        },
                                    }}
                                    openBookModal={openBookModal}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <Heart className="mb-2 size-12 text-rose-300"/>
                                <p className="text-muted-foreground">Votre wishlist est vide</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                    {booksStatus.hasReviews ? (
                        <div className="space-y-4">
                            {user.BookReview.map(review => (
                                <ReviewCard
                                    key={review.id}
                                    review={{
                                        ...review,
                                        User: {
                                            username: user.username,
                                            image: user.image,
                                            favoriteColor: user.favoriteColor ?? "#3b82f6",
                                        },
                                    }}
                                    openBookModal={openBookModal}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <Star className="text-muted-foreground mb-2 size-12"/>
                                <p className="text-muted-foreground">Vous n&#39;avez pas encore écrit d&#39;avis</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
            <PageNumberModal/>
        </div>
    );
};

export default DashboardTabs;
