import DashboardBadge from "@/components/Dashboard/DashboardBadge";
import {Heart, Library, Star} from "lucide-react";
import {useUser} from "@/hooks/useUser";

const DashboardStats = () => {
    const {user} = useUser();
    if (!user) return null;
    return (
        <div className="grid grid-cols-3 gap-2 md:gap-4">
            <DashboardBadge
                type="userBook"
                className="flex items-center justify-center p-2 md:p-4 h-full transition-all hover:shadow-md"
            >
                <div className="flex flex-col items-center w-full">
                    <div className="relative">
                        <div className="flex items-center justify-center bg-green-800/10 p-3 rounded-full">
                            <Library className="h-5 w-5 md:h-6 md:w-6 text-green-800"/>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-600 text-xs text-white font-semibold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                            {user.UserBook.length}
                        </div>
                    </div>
                    <p className="mt-4 text-xs md:text-sm font-medium text-center">Ma bibliothèque</p>
                </div>
            </DashboardBadge>

            <DashboardBadge
                type="userBookWishlist"
                className="flex items-center justify-center p-2 md:p-4 h-full transition-all hover:shadow-md"
            >
                <div className="flex flex-col items-center w-full">
                    <div className="relative">
                        <div className="flex items-center justify-center bg-rose-100 p-3 rounded-full">
                            <Heart className="h-5 w-5 md:h-6 md:w-6 text-rose-500"/>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-rose-500 text-xs text-white font-semibold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                            {user.UserBookWishlist.length}
                        </div>
                    </div>
                    <p className="mt-4 text-xs md:text-sm font-medium text-center">Ma wishlist</p>
                </div>
            </DashboardBadge>

            <DashboardBadge
                type="bookReview"
                className="flex items-center justify-center p-2 md:p-4 h-full transition-all hover:shadow-md"
            >
                <div className="flex flex-col items-center w-full">
                    <div className="relative">
                        <div className="flex items-center justify-center bg-primary/10 p-3 rounded-full">
                            <Star className="h-5 w-5 md:h-6 md:w-6 text-primary"/>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-primary text-xs text-white font-semibold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                            {user.BookReview.length}
                        </div>
                    </div>
                    <p className="mt-4 text-xs md:text-sm font-medium text-center">Mes avis</p>
                </div>
            </DashboardBadge>
        </div>
    );
};

export default DashboardStats;