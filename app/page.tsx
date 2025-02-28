"use client";

import {useState, useEffect, useRef, ReactNode} from "react";
import Image from "next/image";
import {motion, useScroll, useTransform, useInView, AnimatePresence} from "motion/react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {BookOpen, BookMarked, BarChart2, Heart, Star, ChevronRight, Menu, X, Quote, LucideIcon} from "lucide-react";
import {Link} from "next-view-transitions";

export default function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
    const [currentTab, setCurrentTab] = useState("add");

    const {scrollYProgress} = useScroll();

    // Refs for different sections
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const testimonialsRef = useRef(null);
    const contactRef = useRef(null);

    // InView states
    const heroInView = useInView(heroRef, {once: false, margin: "-30%"});
    const featuresInView = useInView(featuresRef, {once: false, margin: "-20%"});
    const testimonialsInView = useInView(testimonialsRef, {once: false, margin: "-20%"});
    const contactInView = useInView(contactRef, {once: false, margin: "-20%"});

    // Auto-cycle testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Parallax effect for hero image
    const heroImgY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
    const heroTextY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

    // Fade-in animations
    const fadeInUp = {
        hidden: {opacity: 0, y: 40},
        visible: {opacity: 1, y: 0, transition: {duration: 0.6, ease: "easeOut"}}
    };

    const staggerChildren = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    // Card hover animation
    const cardHover = {
        rest: {scale: 1, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"},
        hover: {
            scale: 1.03,
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
            transition: {duration: 0.3, ease: "easeInOut"}
        }
    };

    // Feature tab animation
    const tabContentAnimation = {
        hidden: {opacity: 0, x: -20},
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1.0] // Cubic bezier for smooth entrance
            }
        },
        exit: {
            opacity: 0,
            x: 20,
            transition: {
                duration: 0.3
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col overflow-hidden">
            {/* Header with subtle animation */}
            <motion.header
                initial={{y: -100}}
                animate={{y: 0}}
                transition={{duration: 0.5, ease: "easeOut"}}
                className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
            >
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <motion.div
                        className="flex items-center gap-2"
                        whileHover={{scale: 1.05}}
                        transition={{type: "spring", stiffness: 300}}
                    >
                        <BookOpen className="h-8 w-8 text-primary"/>
                        <span className="text-xl font-bold">LivreTrack</span>
                    </motion.div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2"
                        onClick={toggleMenu}
                        aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    >
                        {isMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {["Accueil", "Fonctionnalités", "Témoignages", "Contact"].map((item, index) => (
                            <motion.a
                                key={item}
                                href={item === "Accueil" ? "#" : `#${item.toLowerCase()}`}
                                className="text-sm font-medium hover:text-primary transition-colors"
                                whileHover={{scale: 1.1, color: "var(--primary)"}}
                                initial={{opacity: 0, y: -20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.3, delay: index * 0.1}}
                            >
                                {item}
                            </motion.a>
                        ))}
                        <motion.div
                            initial={{opacity: 0, scale: 0.8}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{duration: 0.5, delay: 0.4}}
                            whileHover={{scale: 1.05}}
                        >
                            <Button>S&#39;inscrire</Button>
                        </motion.div>
                    </nav>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{height: 0, opacity: 0}}
                            animate={{height: "auto", opacity: 1}}
                            exit={{height: 0, opacity: 0}}
                            transition={{duration: 0.3}}
                            className="md:hidden absolute w-full bg-background border-b py-4 px-4 shadow-lg overflow-hidden"
                        >
                            <nav className="flex flex-col gap-4">
                                {["Accueil", "Fonctionnalités", "Témoignages", "Contact"].map((item, index) => (
                                    <motion.a
                                        key={item}
                                        href={item === "Accueil" ? "#" : `#${item.toLowerCase()}`}
                                        className="text-sm font-medium hover:text-primary transition-colors"
                                        onClick={toggleMenu}
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{duration: 0.3, delay: index * 0.1}}
                                    >
                                        {item}
                                    </motion.a>
                                ))}
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{duration: 0.3, delay: 0.4}}
                                >
                                    <Button className="w-full">S&#39;inscrire</Button>
                                </motion.div>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            <main className="flex-1">
                {/* Hero Section with parallax effect */}
                <section ref={heroRef}
                         className="relative py-20 overflow-hidden bg-gradient-to-br from-primary/10 to-background">
                    <motion.div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: "radial-gradient(circle at 30% 50%, rgba(var(--primary-rgb), 0.08) 0%, transparent 70%)",
                            backgroundSize: "100% 100%"
                        }}
                        animate={{
                            backgroundPosition: heroInView ? "0% 0%" : "100% 100%"
                        }}
                        transition={{duration: 20, repeat: Infinity, repeatType: "reverse"}}
                    />

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <motion.div
                                className="space-y-6"
                                style={{y: heroTextY}}
                                initial="hidden"
                                animate={heroInView ? "visible" : "hidden"}
                                variants={staggerChildren}
                            >
                                <motion.h1
                                    className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                                    variants={fadeInUp}
                                >
                                    Ne perdez plus le fil de vos lectures !
                                </motion.h1>
                                <motion.p
                                    className="text-xl text-muted-foreground"
                                    variants={fadeInUp}
                                >
                                    Suivez votre progression facilement avec LivreTrack, l&#39;application qui
                                    transforme
                                    votre expérience de lecture.
                                </motion.p>
                                <motion.div
                                    className="flex flex-col sm:flex-row gap-4 pt-4"
                                    variants={staggerChildren}
                                >
                                    <motion.div variants={fadeInUp} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                                        <Button size="lg" className="gap-2" asChild>
                                            <Link href="/book-shelf">
                                                Commencer gratuitement
                                            </Link>
                                        </Button>
                                    </motion.div>
                                    <motion.div variants={fadeInUp} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                                        <Button size="lg" variant="outline" className="gap-2">
                                            En savoir plus
                                            <ChevronRight className="h-4 w-4"/>
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                className="relative h-[500px] flex items-center justify-center"
                                style={{y: heroImgY}}
                                initial={{opacity: 0, x: 100}}
                                animate={heroInView ? {opacity: 1, x: 0} : {opacity: 0, x: 100}}
                                transition={{duration: 0.8, ease: "easeOut"}}
                            >
                                <motion.div
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[600px] bg-gradient-to-r from-primary/20 to-primary/5 rounded-full blur-3xl"
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        opacity: [0.5, 0.7, 0.5]
                                    }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                />
                                <motion.div
                                    className="relative z-10 flex items-center justify-center"
                                    whileHover={{scale: 1.05, rotate: -2}}
                                    transition={{type: "spring", stiffness: 200}}
                                >
                                    <Image
                                        src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                                        alt="LivreTrack App Mockup"
                                        width={300}
                                        height={600}
                                        className="object-contain rounded-3xl shadow-2xl border-8 border-white dark:border-gray-800"
                                        priority
                                    />
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Features Section with animations on tab change */}
                <section ref={featuresRef} id="fonctionnalités" className="py-20 bg-background">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="text-center mb-16"
                            initial="hidden"
                            animate={featuresInView ? "visible" : "hidden"}
                            variants={staggerChildren}
                        >
                            <motion.h2
                                className="text-3xl md:text-4xl font-bold mb-4"
                                variants={fadeInUp}
                            >
                                Fonctionnalités Clés
                            </motion.h2>
                            <motion.p
                                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                                variants={fadeInUp}
                            >
                                Découvrez comment LivreTrack transforme votre expérience de lecture avec ces
                                fonctionnalités essentielles.
                            </motion.p>
                        </motion.div>

                        <Tabs
                            defaultValue="add"
                            className="w-full"
                            onValueChange={value => setCurrentTab(value)}
                        >
                            <motion.div
                                className="flex justify-center mb-8"
                                initial={{opacity: 0, y: 30}}
                                animate={featuresInView ? {opacity: 1, y: 0} : {opacity: 0, y: 30}}
                                transition={{duration: 0.6, delay: 0.2}}
                            >
                                <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl h-12">
                                    {["add", "track", "stats", "favorites"].map((tab) => (
                                        <motion.div
                                            key={tab}
                                            whileHover={{scale: 1.05}}
                                            whileTap={{scale: 0.95}}
                                            className="flex justify-center items-center"
                                        >
                                            <TabsTrigger value={tab}>
                                                {tab === "add" && "Ajouter"}
                                                {tab === "track" && "Progression"}
                                                {tab === "stats" && "Statistiques"}
                                                {tab === "favorites" && "Favoris"}
                                            </TabsTrigger>
                                        </motion.div>
                                    ))}
                                </TabsList>
                            </motion.div>

                            <div className="relative min-h-[500px]">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentTab}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={tabContentAnimation}
                                        className="absolute inset-0"
                                    >
                                        <TabsContent value="add">
                                            <div className="grid md:grid-cols-2 gap-8 items-center place-items-center">
                                                <div className="space-y-4 justify-self-start">
                                                    <motion.div
                                                        className="inline-block p-3 bg-primary/10 rounded-2xl"
                                                        whileHover={{scale: 1.1, rotate: 5}}
                                                        transition={{type: "spring", stiffness: 300}}
                                                    >
                                                        <BookOpen className="h-8 w-8 text-primary"/>
                                                    </motion.div>
                                                    <h3 className="text-2xl font-bold">Ajoutez vos livres en un
                                                        instant</h3>
                                                    <p className="text-muted-foreground">
                                                        Scannez le code-barres ou recherchez par titre pour ajouter
                                                        instantanément n&#39;importe quel livre à votre bibliothèque
                                                        personnelle.
                                                    </p>
                                                    <motion.ul
                                                        className="space-y-2"
                                                        variants={staggerChildren}
                                                        initial="hidden"
                                                        animate="visible"
                                                    >
                                                        {["Scan de code-barres rapide", "Recherche par titre ou auteur", "Importation depuis d'autres plateformes"].map((item, index) => (
                                                            <motion.li
                                                                key={item}
                                                                className="flex items-center gap-2"
                                                                variants={{
                                                                    hidden: {opacity: 0, x: -20},
                                                                    visible: {
                                                                        opacity: 1,
                                                                        x: 0,
                                                                        transition: {delay: index * 0.1, duration: 0.5}
                                                                    }
                                                                }}
                                                            >
                                                                <motion.div
                                                                    className="h-2 w-2 rounded-full bg-secondary"
                                                                    initial={{scale: 0}}
                                                                    animate={{scale: 1}}
                                                                    transition={{delay: 0.3 + index * 0.1}}
                                                                ></motion.div>
                                                                <span>{item}</span>
                                                            </motion.li>
                                                        ))}
                                                    </motion.ul>
                                                </div>
                                                <motion.div
                                                    className="bg-muted rounded-2xl p-6 aspect-square flex items-center justify-center w-1/2 justify-self-end"
                                                    animate={{opacity: 1, y: 0}}
                                                    transition={{duration: 0.6, delay: 0.3}}
                                                    variants={cardHover}
                                                    initial="rest"
                                                    whileHover="hover"
                                                >
                                                    <Image
                                                        src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                                        alt="Ajouter un livre"
                                                        width={400}
                                                        height={400}
                                                        className="rounded-xl object-cover"
                                                    />
                                                </motion.div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="track">
                                            <div className="grid md:grid-cols-2 items-center place-items-center">
                                                <div className="space-y-4 justify-self-start">
                                                    <motion.div
                                                        className="inline-block p-3 bg-secondary/10 rounded-2xl"
                                                        whileHover={{scale: 1.1, rotate: 5}}
                                                        transition={{type: "spring", stiffness: 300}}
                                                    >
                                                        <BookMarked className="h-8 w-8 text-secondary"/>
                                                    </motion.div>
                                                    <h3 className="text-2xl font-bold">Suivez votre progression</h3>
                                                    <p className="text-muted-foreground">
                                                        Marquez votre progression en pages ou en pourcentage et
                                                        définissez des objectifs de lecture quotidiens ou hebdomadaires.
                                                    </p>
                                                    <motion.ul
                                                        className="space-y-2"
                                                        variants={staggerChildren}
                                                        initial="hidden"
                                                        animate="visible"
                                                    >
                                                        {["Suivi par page ou pourcentage", "Objectifs personnalisables", "Rappels de lecture"].map((item, index) => (
                                                            <motion.li
                                                                key={item}
                                                                className="flex items-center gap-2"
                                                                variants={{
                                                                    hidden: {opacity: 0, x: -20},
                                                                    visible: {
                                                                        opacity: 1,
                                                                        x: 0,
                                                                        transition: {delay: index * 0.1, duration: 0.5}
                                                                    }
                                                                }}
                                                            >
                                                                <motion.div
                                                                    className="h-2 w-2 rounded-full bg-secondary"
                                                                    initial={{scale: 0}}
                                                                    animate={{scale: 1}}
                                                                    transition={{delay: 0.3 + index * 0.1}}
                                                                ></motion.div>
                                                                <span>{item}</span>
                                                            </motion.li>
                                                        ))}
                                                    </motion.ul>
                                                </div>
                                                <motion.div
                                                    className="bg-muted rounded-2xl p-6 aspect-square flex items-center justify-center w-1/2 justify-self-end"
                                                    animate={{opacity: 1, y: 0}}
                                                    transition={{duration: 0.6, delay: 0.3}}
                                                    variants={cardHover}
                                                    initial="rest"
                                                    whileHover="hover"
                                                >
                                                    <Image
                                                        src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                                        alt="Suivre la progression"
                                                        width={400}
                                                        height={400}
                                                        className="rounded-xl object-cover"
                                                    />
                                                </motion.div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="stats">
                                            <div className="grid md:grid-cols-2 gap-8 items-center place-items-center">
                                                <div className="space-y-4 justify-self-start">
                                                    <motion.div
                                                        className="inline-block p-3 bg-accent/10 rounded-2xl"
                                                        whileHover={{scale: 1.1, rotate: 5}}
                                                        transition={{type: "spring", stiffness: 300}}
                                                    >
                                                        <BarChart2 className="h-8 w-8 text-accent"/>
                                                    </motion.div>
                                                    <h3 className="text-2xl font-bold">Analysez vos statistiques</h3>
                                                    <p className="text-muted-foreground">
                                                        Visualisez vos habitudes de lecture avec des graphiques
                                                        détaillés et découvrez vos genres préférés.
                                                    </p>
                                                    <motion.ul
                                                        className="space-y-2"
                                                        variants={staggerChildren}
                                                        initial="hidden"
                                                        animate="visible"
                                                    >
                                                        {["Graphiques de progression", "Analyse par genre et auteur", "Comparaison avec vos objectifs"].map((item, index) => (
                                                            <motion.li
                                                                key={item}
                                                                className="flex items-center gap-2"
                                                                variants={{
                                                                    hidden: {opacity: 0, x: -20},
                                                                    visible: {
                                                                        opacity: 1,
                                                                        x: 0,
                                                                        transition: {delay: index * 0.1, duration: 0.5}
                                                                    }
                                                                }}
                                                            >
                                                                <motion.div
                                                                    className="h-2 w-2 rounded-full bg-accent"
                                                                    initial={{scale: 0}}
                                                                    animate={{scale: 1}}
                                                                    transition={{delay: 0.3 + index * 0.1}}
                                                                ></motion.div>
                                                                <span>{item}</span>
                                                            </motion.li>
                                                        ))}
                                                    </motion.ul>
                                                </div>
                                                <motion.div
                                                    className="bg-muted rounded-2xl p-6 aspect-square flex items-center justify-center w-1/2 justify-self-end"
                                                    animate={{opacity: 1, y: 0}}
                                                    transition={{duration: 0.6, delay: 0.3}}
                                                    variants={cardHover}
                                                    initial="rest"
                                                    whileHover="hover"
                                                >
                                                    <Image
                                                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                                        alt="Statistiques de lecture"
                                                        width={400}
                                                        height={400}
                                                        className="rounded-xl object-cover"
                                                    />
                                                </motion.div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="favorites">
                                            <div className="grid md:grid-cols-2 gap-8 items-center place-items-center">
                                                <div className="space-y-4 justify-self-start">
                                                    <motion.div
                                                        className="inline-block p-3 bg-destructive/10 rounded-2xl"
                                                        whileHover={{scale: 1.1, rotate: 5}}
                                                        transition={{type: "spring", stiffness: 300}}
                                                    >
                                                        <Heart className="h-8 w-8 text-destructive"/>
                                                    </motion.div>
                                                    <h3 className="text-2xl font-bold">Gérez vos favoris</h3>
                                                    <p className="text-muted-foreground">
                                                        Organisez votre bibliothèque avec des collections personnalisées
                                                        et partagez vos recommandations avec vos amis.
                                                    </p>
                                                    <motion.ul
                                                        className="space-y-2"
                                                        variants={staggerChildren}
                                                        initial="hidden"
                                                        animate="visible"
                                                    >
                                                        {["Collections personnalisées", "Partage de recommandations", "Notes et critiques privées"].map((item, index) => (
                                                            <motion.li
                                                                key={item}
                                                                className="flex items-center gap-2"
                                                                variants={{
                                                                    hidden: {opacity: 0, x: -20},
                                                                    visible: {
                                                                        opacity: 1,
                                                                        x: 0,
                                                                        transition: {delay: index * 0.1, duration: 0.5}
                                                                    }
                                                                }}
                                                            >
                                                                <motion.div
                                                                    className="h-2 w-2 rounded-full bg-destructive"
                                                                    initial={{scale: 0}}
                                                                    animate={{scale: 1}}
                                                                    transition={{delay: 0.3 + index * 0.1}}
                                                                ></motion.div>
                                                                <span>{item}</span>
                                                            </motion.li>
                                                        ))}
                                                    </motion.ul>
                                                </div>
                                                <motion.div
                                                    className="bg-muted rounded-2xl p-6 aspect-square flex items-center justify-center w-1/2 justify-self-end"
                                                    animate={{opacity: 1, y: 0}}
                                                    transition={{duration: 0.6, delay: 0.3}}
                                                    variants={cardHover}
                                                    initial="rest"
                                                    whileHover="hover"
                                                >
                                                    <Image
                                                        src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                                        alt="Gestion des favoris"
                                                        width={400}
                                                        height={400}
                                                        className="rounded-xl object-cover"
                                                    />
                                                </motion.div>
                                            </div>
                                        </TabsContent>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </Tabs>
                    </div>
                </section>

                {/* Testimonials Section with carousel animation */}
                <section ref={testimonialsRef} id="témoignages"
                         className="py-20 bg-gradient-to-br from-primary/5 to-background">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="text-center mb-16"
                            initial="hidden"
                            animate={testimonialsInView ? "visible" : "hidden"}
                            variants={staggerChildren}
                        >
                            <motion.h2
                                className="text-3xl md:text-4xl font-bold mb-4"
                                variants={fadeInUp}
                            >
                                Ce que disent nos utilisateurs
                            </motion.h2>
                            <motion.p
                                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                                variants={fadeInUp}
                            >
                                Découvrez comment LivreTrack a transformé les habitudes de lecture de nos utilisateurs.
                            </motion.p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            {/* Featured testimonial */}
                            <motion.div
                                className="md:col-span-6 lg:col-span-5"
                                initial={{opacity: 0, x: -50}}
                                animate={testimonialsInView ? {opacity: 1, x: 0} : {opacity: 0, x: -50}}
                                transition={{duration: 0.6}}
                                whileHover={{scale: 1.02}}
                            >
                                <motion.div
                                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 h-full flex flex-col relative overflow-hidden"
                                    variants={cardHover}
                                    initial="rest"
                                    whileHover="hover"
                                >
                                    <motion.div
                                        className="absolute -top-6 -left-6 text-primary/10"
                                        animate={{
                                            rotate: [0, 10, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{
                                            duration: 5,
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }}
                                    >
                                        <Quote size={120}/>
                                    </motion.div>
                                    <div className="relative z-10">
                                        <div className="flex flex-col items-center gap-4 mb-6">
                                            <motion.div
                                                whileHover={{scale: 1.1, rotate: 5}}
                                                transition={{type: "spring", stiffness: 300}}
                                            >
                                                <Image
                                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
                                                    alt="Sophie Martin"
                                                    width={70}
                                                    height={70}
                                                    className="rounded-full object-cover border-4 border-primary/20"
                                                />
                                            </motion.div>
                                            <div>
                                                <p className="font-semibold text-lg">Sophie Martin</p>
                                                <div className="flex items-center">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <motion.p
                                                className="text-lg mb-6"
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                transition={{delay: 0.3, duration: 0.8}}
                                            >
                                                &#34;LivreTrack a transformé ma façon de lire. Je peux enfin suivre tous
                                                mes
                                                livres en cours et avoir une vue d&#39;ensemble sur mes habitudes de
                                                lecture. C&#39;est exactement ce qu&#39;il me fallait !&#34;
                                            </motion.p>
                                            <p className="text-sm text-muted-foreground italic">Utilisatrice depuis 8
                                                mois</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Testimonial grid */}
                            <div className="md:col-span-6 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {testimonials.map((testimonial, index) => (
                                    <motion.div
                                        key={testimonial.id}
                                        initial={{opacity: 0, y: 50}}
                                        animate={testimonialsInView ? {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                duration: 0.6,
                                                delay: 0.1 * index
                                            }
                                        } : {opacity: 0, y: 50}}
                                        whileHover={{y: -8}}
                                        transition={{type: "spring", stiffness: 200}}
                                    >
                                        <Card className="h-full">
                                            <CardHeader className="pb-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-3">
                                                        <Image
                                                            src={testimonial.avatar}
                                                            alt={testimonial.name}
                                                            width={50}
                                                            height={50}
                                                            className="rounded-full object-cover"
                                                        />
                                                        <div>
                                                            <CardTitle
                                                                className="text-base">{testimonial.name}</CardTitle>
                                                            <div className="flex items-center mt-1">
                                                                {Array.from({length: testimonial.rating}).map((_, i) => (
                                                                    <Star key={i}
                                                                          className="w-3 h-3 text-yellow-400 fill-yellow-400"/>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <motion.div
                                                        animate={{
                                                            rotate: [0, 10, 0]
                                                        }}
                                                        transition={{
                                                            duration: 4,
                                                            delay: index * 0.5,
                                                            repeat: Infinity,
                                                            repeatType: "reverse"
                                                        }}
                                                    >
                                                        <Quote className="h-10 w-10 text-primary/20"/>
                                                    </motion.div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground">{testimonial.content}</p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section ref={contactRef} id="contact" className="py-20 bg-background">
                    <motion.div
                        className="container mx-auto px-4"
                        initial="hidden"
                        animate={contactInView ? "visible" : "hidden"}
                        variants={staggerChildren}
                    >
                        <motion.div
                            className="max-w-3xl mx-auto text-center mb-12"
                            variants={fadeInUp}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à transformer votre expérience de
                                lecture ?</h2>
                            <p className="text-xl text-muted-foreground">Inscrivez-vous à notre newsletter pour être
                                informé du lancement.</p>
                        </motion.div>

                        <motion.div
                            className="max-w-lg mx-auto"
                            variants={fadeInUp}
                        >
                            <Card>
                                <CardContent className="pt-6">
                                    <motion.form
                                        className="space-y-4"
                                        onSubmit={(e) => e.preventDefault()}
                                        initial={{opacity: 0, y: 20}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{delay: 0.2, duration: 0.5}}
                                    >
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <label htmlFor="firstName"
                                                       className="text-sm font-medium">Prénom</label>
                                                <motion.input
                                                    whileFocus={{scale: 1.02}}
                                                    id="firstName"
                                                    className="w-full p-3 rounded-md border bg-background"
                                                    placeholder="Votre prénom"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="lastName" className="text-sm font-medium">Nom</label>
                                                <motion.input
                                                    whileFocus={{scale: 1.02}}
                                                    id="lastName"
                                                    className="w-full p-3 rounded-md border bg-background"
                                                    placeholder="Votre nom"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                                            <motion.input
                                                whileFocus={{scale: 1.02}}
                                                id="email"
                                                type="email"
                                                className="w-full p-3 rounded-md border bg-background"
                                                placeholder="votre@email.com"
                                            />
                                        </div>
                                        <motion.div
                                            whileHover={{scale: 1.03}}
                                            whileTap={{scale: 0.97}}
                                        >
                                            <Button className="w-full py-6 text-lg">
                                                Rejoindre la liste d&#39;attente
                                            </Button>
                                        </motion.div>
                                    </motion.form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                </section>
            </main>

            {/* Footer with animation */}
            <motion.footer
                className="py-12 bg-muted"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.8, delay: 0.5}}
            >
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <motion.div
                            className="space-y-4"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.1, duration: 0.6}}
                        >
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-6 w-6 text-primary"/>
                                <span className="text-lg font-bold">LivreTrack</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Transformez votre expérience de lecture avec notre application de suivi et
                                d&#39;analyse.
                            </p>
                        </motion.div>

                        {[
                            {
                                title: "Produit",
                                links: ["Fonctionnalités", "Témoignages", "Tarifs", "FAQ"]
                            },
                            {
                                title: "Entreprise",
                                links: ["À propos", "Blog", "Carrières", "Presse"]
                            },
                            {
                                title: "Ressources",
                                links: ["Support", "Tutoriels", "Documentation", "Contact"]
                            }
                        ].map((category, index) => (
                            <motion.div
                                key={category.title}
                                className="space-y-4"
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: 0.1 * (index + 1), duration: 0.6}}
                            >
                                <h4 className="font-semibold">{category.title}</h4>
                                <ul className="space-y-2">
                                    {category.links.map((link) => (
                                        <motion.li key={link} whileHover={{x: 5}}>
                                            <a
                                                href="#"
                                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {link}
                                            </a>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.5, duration: 0.8}}
                    >
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} LivreTrack. Tous droits réservés.
                        </p>
                        <div className="flex gap-4 mt-4 sm:mt-0">
                            {["Twitter", "Instagram", "LinkedIn", "GitHub"].map((social) => (
                                <motion.a
                                    key={social}
                                    href="#"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    whileHover={{y: -3}}
                                >
                                    {social}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.footer>
        </div>
    )
}

// Ajouter ces données à la fin, avant la dernière accolade de fermeture
// Données pour les témoignages
const testimonials = [
    {
        id: 1,
        name:
            "Thomas Dubois",
        avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        rating:
            5,
        content:
            "Depuis que j'utilise LivreTrack, je lis deux fois plus qu'avant. Les statistiques me motivent vraiment à atteindre mes objectifs de lecture."
    },
    {
        id: 2,
        name:
            "Julie Moreau",
        avatar:
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        rating:
            4,
        content:
            "Excellente application pour les lecteurs passionnés. J'adore pouvoir organiser ma bibliothèque et suivre ma progression."
    },
    {
        id: 3,
        name:
            "Marc Lefevre",
        avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        rating:
            5,
        content:
            "Interface intuitive et fonctionnalités complètes. LivreTrack est devenu mon compagnon de lecture au quotidien."
    },
    {
        id: 4,
        name:
            "Emma Bernard",
        avatar:
            "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        rating:
            5,
        content:
            "Pratique pour suivre les livres lus et à lire. Je recommande vivement pour tous les amoureux de littérature !"
    }
];

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    delay: number;
}

// Animation d'apparition progressive des éléments
const FeatureCard = ({
                         icon: Icon, title, description, delay = 0
                     }: FeatureCardProps) => {
    return (
        <motion.div
            className="flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-md"
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: "-100px"}}
            transition={{
                duration: 0.5,
                delay,
                type: "spring",
                stiffness: 100
            }}
            whileHover={{
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
        >
            <div className="mb-4 bg-primary/10 p-3 rounded-full">
                <Icon className="h-8 w-8 text-primary"/>
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </motion.div>
    );
};

interface FloatingElementProps {
    children?: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

// Animation d'un élément flottant pour décoration
const FloatingElement = ({
                             children, delay = 0, duration = 4, className = ""
                         }: FloatingElementProps) => {
    return (
        <motion.div
            className={className}
            animate={{
                y: [0, -15, 0],
                rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
                duration,
                repeat: Infinity,
                delay
            }}
        >
            {children}
        </motion.div>
    );
};
