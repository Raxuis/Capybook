import DashboardBadge from "@/components/Dashboard/DashboardBadge";
import {Heart, Library, Star} from "lucide-react";
import {UserWithRelations} from "@/hooks/useUser";

const DashboardStats = ({user}: { user: UserWithRelations }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DashboardBadge
                type="userBook"
                className="flex items-center p-4 h-full transition-all hover:shadow-md"
            >
                <div className="flex items-center space-x-4 w-full">
                    <div className="flex items-center justify-center bg-green-800/10 p-3 rounded-full">
                        <Library className="h-6 w-6 text-green-800"/>
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
    );
};

export default DashboardStats;
