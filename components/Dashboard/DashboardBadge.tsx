import React, {ReactNode} from 'react';
import {cn} from "@/lib/utils";

type Props = {
    className?: string;
    type: "userBook" | "bookReview" | "userBookWishlist";
    children: ReactNode;
}

const DashboardBadge = ({className, type, children}: Props) => {
    return (
        <span className={cn(
            "px-3 py-1 text-xs font-medium border rounded-lg text-center cursor-default",
            type === "userBook" ?
                "bg-green-100 text-green-800"
                : type === "bookReview" ?
                    "bg-blue-100 text-blue-800"
                    : type === "userBookWishlist" ?
                        "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800",
            className
        )}>
            {children}
            </span>
    );
};

export default DashboardBadge;
