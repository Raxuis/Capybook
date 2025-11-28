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
                className="flex h-full items-center justify-center p-2 transition-all hover:shadow-md md:p-4"
            >
                <div className="flex w-full flex-col items-center">
                    <div className="relative">
                        <div className="flex items-center justify-center rounded-full bg-green-800/10 p-3">
                            <Library className="size-5 text-green-800 md:size-6"/>
                        </div>
                        <div className="absolute -bottom-2 -right-2 flex size-6 items-center justify-center rounded-full border-2 border-white bg-green-600 text-xs font-semibold text-white">
                            {user.UserBook.length}
                        </div>
                    </div>
                    <p className="mt-4 text-center text-xs font-medium md:text-sm">Ma bibliothèque</p>
                </div>
            </DashboardBadge>

            <DashboardBadge
                type="userBookWishlist"
                className="flex h-full items-center justify-center p-2 transition-all hover:shadow-md md:p-4"
            >
                <div className="flex w-full flex-col items-center">
                    <div className="relative">
                        <div className="flex items-center justify-center rounded-full bg-rose-100 p-3">
                            <Heart className="size-5 text-rose-500 md:size-6"/>
                        </div>
                        <div className="absolute -bottom-2 -right-2 flex size-6 items-center justify-center rounded-full border-2 border-white bg-rose-500 text-xs font-semibold text-white">
                            {user.UserBookWishlist.length}
                        </div>
                    </div>
                    <p className="mt-4 text-center text-xs font-medium md:text-sm">Ma wishlist</p>
                </div>
            </DashboardBadge>

            <DashboardBadge
                type="bookReview"
                className="flex h-full items-center justify-center p-2 transition-all hover:shadow-md md:p-4"
            >
                <div className="flex w-full flex-col items-center">
                    <div className="relative">
                        <div className="bg-primary/10 flex items-center justify-center rounded-full p-3">
                            <Star className="text-primary size-5 md:size-6"/>
                        </div>
                        <div className="bg-primary absolute -bottom-2 -right-2 flex size-6 items-center justify-center rounded-full border-2 border-white text-xs font-semibold text-white">
                            {user.BookReview.length}
                        </div>
                    </div>
                    <p className="mt-4 text-center text-xs font-medium md:text-sm">Mes avis</p>
                </div>
            </DashboardBadge>
        </div>
    );
};

export default DashboardStats;