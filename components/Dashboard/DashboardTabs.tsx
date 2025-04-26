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

type Props = {
    openBookModal: (book: BookType) => void;
}

const DashboardTabs = ({openBookModal}: Props) => {

    const {user} = useUser();
    if (!user) return null;

    const booksStatus = useMemo(() => {
        return {
            hasBooks: user.UserBook.length > 0,
            hasWishlist: user.UserBookWishlist.length > 0,
            hasReviews: user.BookReview.length > 0
        }
    }, [user.UserBook, user.UserBookWishlist, user.BookReview]);

    return (
        <div className="relative">
            <Tabs defaultValue={booksStatus.hasBooks ? "library" : booksStatus.hasWishlist ? "wishlist" : "library"}
                  className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="library" disabled={!booksStatus.hasBooks}
                                 className="flex items-center space-x-2">
                        <Book className="h-4 w-4"/>
                        <span>Ma bibliothèque</span>
                    </TabsTrigger>
                    <TabsTrigger value="wishlist" disabled={!booksStatus.hasWishlist}
                                 className="flex items-center space-x-2">
                        <Heart className="h-4 w-4"/>
                        <span>Ma wishlist</span>
                    </TabsTrigger>
                    <TabsTrigger value="reviews" disabled={!booksStatus.hasReviews}
                                 className="flex items-center space-x-2">
                        <Star className="h-4 w-4"/>
                        <span>Mes avis</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="library" className="space-y-4">
                    {booksStatus.hasBooks ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user.UserBook.map(userBook => (
                                <LibraryCard
                                    key={userBook.id}
                                    userBook={userBook}
                                    userId={user.id}
                                    openBookModal={openBookModal}
                                />
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
                                <WishlistCard
                                    key={wishlistItem.id}
                                    wishlistItem={wishlistItem}
                                    openBookModal={openBookModal}
                                />
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
                                <ReviewCard
                                    key={review.id}
                                    review={review}
                                    openBookModal={openBookModal}
                                />
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
            <PageNumberModal userId={user.id}/>
        </div>
    );
};

export default DashboardTabs;
