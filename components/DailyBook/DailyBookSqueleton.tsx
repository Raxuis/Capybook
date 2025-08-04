"use client";
import { motion } from "motion/react";
import { BookOpen } from "lucide-react";

export const DailyBookSkeleton = () => (
    <div className="mx-auto max-w-4xl p-4">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-purple-50 p-6"
        >
            <div className="mb-4 flex items-center space-x-3">
                <div className="flex size-10 animate-pulse items-center justify-center rounded-full bg-blue-200">
                    <BookOpen className="size-5 text-blue-400" />
                </div>
                <div>
                    <div className="mb-2 h-6 w-48 animate-pulse rounded bg-blue-200"></div>
                    <div className="h-4 w-32 animate-pulse rounded bg-blue-100"></div>
                </div>
            </div>
            <div className="h-16 w-full animate-pulse rounded bg-blue-100"></div>
        </motion.div>

        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="p-6">
                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Skeleton pour l'image */}
                    <div className="shrink-0 self-center lg:self-start">
                        <div className="h-64 w-48 animate-pulse rounded-lg bg-gray-200"></div>
                    </div>

                    {/* Skeleton pour les détails */}
                    <div className="flex-1 space-y-4">
                        <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
                        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                            <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-6 w-16 animate-pulse rounded-full bg-gray-200"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 p-6">
                <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
            </div>
        </div>

        {/* Animation de particules flottantes */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute size-2 rounded-full bg-blue-300 opacity-20"
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