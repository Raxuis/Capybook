import React, {ReactNode} from 'react';
import {cn} from "@/lib/utils";

type Props = {
    className?: string;
    type: "userBook" | "bookReview";
    children: ReactNode;
}

const DashboardBadge = ({className, type, children}: Props) => {
    return (
        <span className={cn(
            "px-3 py-1 text-xs font-medium border rounded-lg text-center w-1/3 cursor-default",
            type === "userBook" ?
                "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800",
            className
        )}>
            {children}
            </span>
    );
};

export default DashboardBadge;
