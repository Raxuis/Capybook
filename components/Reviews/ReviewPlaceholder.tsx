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
            className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
        >
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full"/>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32"/>
                            <Skeleton className="h-3 w-24"/>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-amber-500"/>
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
