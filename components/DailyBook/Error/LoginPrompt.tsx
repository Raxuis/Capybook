"use client";
import { motion } from "motion/react";
import { BookOpen } from "lucide-react";

export const LoginPrompt = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex h-full max-w-md flex-col items-center justify-center p-8 text-center"
    >
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-blue-50">
            <BookOpen className="size-10 text-blue-500" />
        </div>
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
            Veuillez vous connecter
        </h1>
        <p className="mb-6 text-gray-600">
            Pour accéder au livre du jour, veuillez vous connecter.
        </p>
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
            Se connecter
        </motion.button>
    </motion.div>
);