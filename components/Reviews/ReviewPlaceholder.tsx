"use client";

import {motion} from "motion/react";
import {Skeleton} from "@/components/ui/skeleton";
import {Star} from "lucide-react";

export const ReviewPlaceholder = () => {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3}}
            className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm"
        >
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Skeleton className="size-10 rounded-full"/>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32"/>
                            <Skeleton className="h-3 w-24"/>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Star className="size-4 text-amber-500"/>
                        <Skeleton className="h-4 w-8"/>
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-3/4"/>
                </div>
                <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-32"/>
                    <Skeleton className="h-3 w-24"/>
                </div>
            </div>
        </motion.div>
    );
};
