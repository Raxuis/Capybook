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
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
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
                className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                <motion.div variants={itemVariants}>
                    <CardHeader
                        className="bg-primary text-white relative overflow-hidden">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <motion.div
                                    initial={{opacity: 0, x: -20}}
                                    animate={{opacity: 1, x: 0}}
                                    transition={{delay: 0.3}}
                                >
                                    <CardTitle className="text-2xl font-bold mb-2 leading-tight">
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
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="flex-shrink-0 self-center lg:self-start">
                                <motion.div
                                    className="relative group"
                                    whileHover={{scale: 1.05}}
                                    transition={{type: "spring", stiffness: 200}}
                                >
                                    {dailyBook.cover ? (
                                        <div className="relative">
                                            {!imageLoaded && (
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse">
                                                    <div className="flex items-center justify-center h-full">
                                                        <motion.div
                                                            animate={{
                                                                rotate: [0, 360],
                                                                scale: [1, 1.2, 1],
                                                            }}
                                                            transition={{duration: 2, repeat: Infinity, ease: "linear"}}
                                                        >
                                                            <Sparkles className="w-8 h-8 text-gray-400"/>
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            )}

                                            <motion.img
                                                src={dailyBook.cover}
                                                alt={dailyBook.title}
                                                className={`w-48 h-64 object-cover rounded-lg shadow-xl transition-opacity duration-500 ${
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
                                                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="absolute bottom-2 left-2 right-2">
                                                    <div className="bg-white/90 rounded-lg p-2 backdrop-blur-sm">
                                                        <div className="flex items-center justify-center space-x-1">
                                                            <Star className="w-4 h-4 text-yellow-500 fill-current"/>
                                                            <span className="text-xs font-medium">Livre du jour</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className="w-48 h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                                            <div className="text-center">
                                                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2"/>
                                                <span className="text-gray-500 text-sm">Pas de couverture</span>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                            <div className="flex-1 space-y-6">
                                {dailyBook.authors && dailyBook.authors.length > 0 && (
                                    <motion.div variants={itemVariants}>
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Users className="w-5 h-5 text-primary"/>
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
                                                        className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-default"
                                                    >
                                                        {author}
                                                    </Badge>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                <motion.div variants={itemVariants}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {dailyBook.numberOfPages && (
                                            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                                <FileText className="w-4 h-4 text-gray-600"/>
                                                <span className="text-sm font-medium text-gray-800">
                                                    {dailyBook.numberOfPages} pages
                                                  </span>
                                            </div>
                                        )}

                                        {dailyBook.publishYear && (
                                            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                                <Calendar className="w-4 h-4 text-gray-600"/>
                                                <span className="text-sm font-medium text-gray-800">
                                                    Publié en {dailyBook.publishYear}
                                                  </span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {dailyBook.subjects && dailyBook.subjects.length > 0 && (
                                    <motion.div variants={itemVariants}>
                                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                                            <Sparkles className="w-5 h-5 text-primary"/>
                                            <span>Genres</span>
                                        </h3>
                                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto px-1">
                                            {dailyBook.subjects.slice(0, 10).map((subject, index) => (
                                                <motion.div
                                                    key={index}
                                                    variants={badgeVariants}
                                                    whileHover={{scale: 1.02}}
                                                    custom={index}
                                                >
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs hover:bg-primary/50 hover:border-primary/20 transition-colors cursor-default"
                                                    >
                                                        {subject}
                                                    </Badge>
                                                </motion.div>
                                            ))}
                                            {dailyBook.subjects.length > 10 && (
                                                <motion.div variants={badgeVariants}>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs bg-primary/50 hover:bg-primary/50 hover:border-primary/20 transition-colors cursor-default"
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
                            className="text-sm text-gray-600 text-center leading-relaxed"
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
                                className="w-full flex items-center justify-center"
                                onClick={() => {
                                    window.open(`https://openlibrary.org${dailyBook.key}`, "_blank");
                                }}
                            >
                                <ExternalLink className="w-4 h-4 mr-2"/>
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