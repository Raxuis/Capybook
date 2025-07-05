"use client";
import { motion } from "motion/react";
import { BookOpen } from "lucide-react";

export const LoginPrompt = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center p-8"
    >
        <div className="bg-blue-50 rounded-full w-20 h-20 mb-6 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Veuillez vous connecter
        </h1>
        <p className="text-gray-600 mb-6">
            Pour accéder au livre du jour, veuillez vous connecter.
        </p>
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
            Se connecter
        </motion.button>
    </motion.div>
);