"use client";
import { motion } from "motion/react";
import { BookOpen } from "lucide-react";

export const DailyBookSkeleton = () => (
    <div className="max-w-4xl mx-auto p-4">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-100"
        >
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-200 rounded-full animate-pulse flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <div className="w-48 h-6 bg-blue-200 rounded animate-pulse mb-2"></div>
                    <div className="w-32 h-4 bg-blue-100 rounded animate-pulse"></div>
                </div>
            </div>
            <div className="w-full h-16 bg-blue-100 rounded animate-pulse"></div>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Skeleton pour l'image */}
                    <div className="flex-shrink-0 self-center lg:self-start">
                        <div className="w-48 h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>

                    {/* Skeleton pour les détails */}
                    <div className="flex-1 space-y-4">
                        <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-gray-50">
                <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
        </div>

        {/* Animation de particules flottantes */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-20"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}
        </div>
    </div>
);