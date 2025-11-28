"use client";
import { motion } from "motion/react";
import { BookOpen } from "lucide-react";

interface ErrorStateProps {
    message: string;
}

export const ErrorState = ({ message }: ErrorStateProps) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-md p-8 text-center"
    >
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-50">
            <BookOpen className="size-8 text-red-400" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-gray-800">{message}</h2>
        <p className="text-sm text-gray-600">
            Revenez plus tard pour découvrir votre prochain livre !
        </p>
    </motion.div>
);