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
        className="max-w-md mx-auto text-center p-8"
    >
        <div className="bg-red-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{message}</h2>
        <p className="text-gray-600 text-sm">
            Revenez plus tard pour découvrir votre prochain livre !
        </p>
    </motion.div>
);