"use client";
import { motion } from "motion/react";
import { Sparkles, Calendar } from "lucide-react";

export const DailyBookHeader = () => (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
    >
        <div className="bg-secondary relative mb-8 overflow-hidden rounded-2xl p-6 text-white">
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                    x: ["-100%", "100%"],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 5,
                }}
            />

            <div className="relative z-10 mb-4 flex items-center space-x-4">
                <motion.div
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="rounded-full bg-white/20 p-3"
                >
                    <Sparkles className="size-6" />
                </motion.div>

                <div>
                    <h1 className="mb-2 text-3xl font-bold">Livre du jour</h1>
                    <div className="flex items-center space-x-2 text-blue-100">
                        <Calendar className="size-4" />
                        <span className="text-sm">
              {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
              })}
            </span>
                    </div>
                </div>
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative z-10 leading-relaxed text-blue-100"
            >
                Bienvenue dans la toute dernière fonctionnalité de Capybook !
                Chaque jour, nous vous proposons un livre différent à découvrir,
                lire et surtout à apprécier. ✨
            </motion.p>
        </div>
    </motion.div>
);