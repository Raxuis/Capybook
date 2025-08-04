"use client";

import {useState} from "react";
import {motion} from "motion/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {
    BookOpen,
    Users,
    Calendar,
    FileText,
    ExternalLink,
    Star,
    Sparkles,
} from "lucide-react";
import {Variants} from "motion";

// Interface pour les props
interface DailyBookData {
    title: string;
    authors?: string[];
    cover?: string;
    numberOfPages?: number;
    publishYear?: number;
    subjects?: string[];
    key: string;
}

const DailyBookCard = ({dailyBook}: { dailyBook: DailyBookData }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const containerVariants: Variants = {
        hidden: {opacity: 0, y: 20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: {opacity: 0, y: 20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {duration: 0.5},
        },
    };

    // Animation pour les badges
    const badgeVariants: Variants = {
        hidden: {opacity: 0, scale: 0.8},
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 10,
            },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative"
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute size-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                        style={{
                            left: `${10 + i * 12}%`,
                            top: `${20 + (i % 3) * 30}%`,
                        }}
                        animate={{
                            y: [0, -10, 0],
                            opacity: [0.3, 0.8, 0.3],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 2 + Math.random(),
                            repeat: Infinity,
                            delay: i * 0.2,
                        }}
                    />
                ))}
            </div>

            <Card
                className="hover:shadow-3xl overflow-hidden border-0 bg-white/80 shadow-2xl backdrop-blur-sm transition-all duration-500">
                <motion.div variants={itemVariants}>
                    <CardHeader
                        className="bg-primary relative overflow-hidden text-white">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <motion.div
                                    initial={{opacity: 0, x: -20}}
                                    animate={{opacity: 1, x: 0}}
                                    transition={{delay: 0.3}}
                                >
                                    <CardTitle className="mb-2 text-2xl font-bold leading-tight">
                                        {dailyBook.title}
                                    </CardTitle>
                                    <CardDescription className="text-blue-100">
                                        Découvrez le livre du jour, soigneusement sélectionné pour
                                        enrichir votre expérience de lecture.
                                    </CardDescription>
                                </motion.div>
                            </div>
                        </div>
                    </CardHeader>
                </motion.div>

                <CardContent className="p-6">
                    <motion.div variants={itemVariants}>
                        <div className="flex flex-col gap-8 lg:flex-row">
                            <div className="shrink-0 self-center lg:self-start">
                                <motion.div
                                    className="group relative"
                                    whileHover={{scale: 1.05}}
                                    transition={{type: "spring", stiffness: 200}}
                                >
                                    {dailyBook.cover ? (
                                        <div className="relative">
                                            {!imageLoaded && (
                                                <div
                                                    className="absolute inset-0 animate-pulse rounded-lg bg-gradient-to-br from-gray-200 to-gray-300">
                                                    <div className="flex h-full items-center justify-center">
                                                        <motion.div
                                                            animate={{
                                                                rotate: [0, 360],
                                                                scale: [1, 1.2, 1],
                                                            }}
                                                            transition={{duration: 2, repeat: Infinity, ease: "linear"}}
                                                        >
                                                            <Sparkles className="size-8 text-gray-400"/>
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            )}

                                            <motion.img
                                                src={dailyBook.cover}
                                                alt={dailyBook.title}
                                                className={`h-64 w-48 rounded-lg object-cover shadow-xl transition-opacity duration-500 ${
                                                    imageLoaded ? "opacity-100" : "opacity-0"
                                                }`}
                                                onLoad={() => setImageLoaded(true)}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = "/placeholder-book.jpg";
                                                    setImageLoaded(true);
                                                }}
                                            />

                                            <div
                                                className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                <div className="absolute inset-x-2 bottom-2">
                                                    <div className="rounded-lg bg-white/90 p-2 backdrop-blur-sm">
                                                        <div className="flex items-center justify-center space-x-1">
                                                            <Star className="size-4 fill-current text-yellow-500"/>
                                                            <span className="text-xs font-medium">Livre du jour</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className="flex h-64 w-48 items-center justify-center rounded-lg bg-gradient-to-br from-gray-200 to-gray-300">
                                            <div className="text-center">
                                                <BookOpen className="mx-auto mb-2 size-12 text-gray-400"/>
                                                <span className="text-sm text-gray-500">Pas de couverture</span>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                            <div className="flex-1 space-y-6">
                                {dailyBook.authors && dailyBook.authors.length > 0 && (
                                    <motion.div variants={itemVariants}>
                                        <div className="mb-3 flex items-center space-x-2">
                                            <Users className="text-primary size-5"/>
                                            <h3 className="font-semibold text-gray-800">
                                                {dailyBook.authors.length > 1 ? "Auteurs" : "Auteur"}
                                            </h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {dailyBook.authors.map((author, index) => (
                                                <motion.div
                                                    key={index}
                                                    variants={badgeVariants}
                                                    whileHover={{scale: 1.01}}
                                                >
                                                    <Badge
                                                        className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-default transition-colors"
                                                    >
                                                        {author}
                                                    </Badge>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                <motion.div variants={itemVariants}>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {dailyBook.numberOfPages && (
                                            <div className="flex items-center space-x-2 rounded-lg bg-gray-50 p-3">
                                                <FileText className="size-4 text-gray-600"/>
                                                <span className="text-sm font-medium text-gray-800">
                                                    {dailyBook.numberOfPages} pages
                                                  </span>
                                            </div>
                                        )}

                                        {dailyBook.publishYear && (
                                            <div className="flex items-center space-x-2 rounded-lg bg-gray-50 p-3">
                                                <Calendar className="size-4 text-gray-600"/>
                                                <span className="text-sm font-medium text-gray-800">
                                                    Publié en {dailyBook.publishYear}
                                                  </span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {dailyBook.subjects && dailyBook.subjects.length > 0 && (
                                    <motion.div variants={itemVariants}>
                                        <h3 className="mb-3 flex items-center space-x-2 font-semibold text-gray-800">
                                            <Sparkles className="text-primary size-5"/>
                                            <span>Genres</span>
                                        </h3>
                                        <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto px-1">
                                            {dailyBook.subjects.slice(0, 10).map((subject, index) => (
                                                <motion.div
                                                    key={index}
                                                    variants={badgeVariants}
                                                    whileHover={{scale: 1.02}}
                                                    custom={index}
                                                >
                                                    <Badge
                                                        variant="outline"
                                                        className="hover:bg-primary/50 hover:border-primary/20 cursor-default text-xs transition-colors"
                                                    >
                                                        {subject}
                                                    </Badge>
                                                </motion.div>
                                            ))}
                                            {dailyBook.subjects.length > 10 && (
                                                <motion.div variants={badgeVariants}>
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-primary/50 hover:bg-primary/50 hover:border-primary/20 cursor-default text-xs transition-colors"
                                                    >
                                                        +{dailyBook.subjects.length - 10} autres
                                                    </Badge>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </CardContent>

                <CardFooter className="bg-gradient-to-r from-gray-50 to-blue-50 p-6">
                    <motion.div variants={itemVariants} className="w-full space-y-4">
                        <motion.p
                            className="text-center text-sm leading-relaxed text-gray-600"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{delay: 0.5}}
                        >
                            🌟 Chaque jour, un nouveau livre vous attend. N&#39;oubliez pas de
                            revenir demain pour découvrir le prochain ! 🌟
                        </motion.p>

                        <motion.div
                            whileHover={{scale: 1.015}}
                            whileTap={{scale: 1}}
                            className="w-full"
                        >
                            <Button
                                variant="default"
                                className="flex w-full items-center justify-center"
                                onClick={() => {
                                    window.open(`https://openlibrary.org${dailyBook.key}`, "_blank");
                                }}
                            >
                                <ExternalLink className="mr-2 size-4"/>
                                Découvrir sur Open Library
                            </Button>
                        </motion.div>
                    </motion.div>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default DailyBookCard;