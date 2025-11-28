"use client";
import { motion } from "motion/react";
import { Suspense } from "react";
import DailyBookCard from "@/components/DailyBook/DailyBookCard";
import { DailyBookSkeleton } from "./DailyBookSqueleton";
import {DailyBookData} from "@/actions/daily-book";

interface DailyBookContentProps {
    dailyBook: DailyBookData;
}

export const DailyBookContent = ({ dailyBook }: DailyBookContentProps) => (
    <Suspense fallback={<DailyBookSkeleton />}>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            <DailyBookCard dailyBook={dailyBook} />
        </motion.div>
    </Suspense>
);