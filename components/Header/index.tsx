"use client";

import {signOut} from 'next-auth/react';
import {BookOpen, Menu, X} from "lucide-react";
import {useAuth} from "@/hooks/useAuth";
import {AnimatePresence, motion} from "motion/react";
import {useState, useEffect} from "react";
import {navigation} from "@/constants";
import {cn} from "@/lib/utils";
import {Link} from "next-view-transitions";
import {usePathname} from 'next/navigation'


export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const {navigation: headerElements} = navigation;
    const {isAuthenticated} = useAuth();
    const pathname = usePathname();
    let headerElementsLength = 0;

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSignOut = async () => {
        await signOut({redirectTo: '/login'});
    };

    return (
        <motion.header
            initial={{y: -100}}
            animate={{y: 0}}
            transition={{duration: 0.5, ease: "easeOut"}}
            className={cn(
                "sticky top-0 z-50 transition-all duration-300",
                scrolled
                    ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm py-4"
                    : "bg-transparent py-4"
            )}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                <motion.div
                    whileHover={{scale: 1.05}}
                    transition={{type: "spring", stiffness: 300}}
                >
                    <Link href="/" className="flex items-center gap-2">
                        <BookOpen className="h-8 w-8 text-primary"/>
                        <span className="text-xl font-bold">LivreTrack</span>
                    </Link>
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
                    {
                        headerElements.map((headerElement) => {
                            if (headerElement.url === pathname) {
                                return headerElement.links.map((item, index) => (
                                    <motion.a
                                        key={item.link}
                                        href={item.link}
                                        className="text-sm font-medium hover:text-primary transition-colors"
                                        whileHover={{scale: 1.1, color: "var(--primary)"}}
                                        initial={{opacity: 0, y: -20}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{duration: 0.3, delay: index * 0.1}}
                                    >
                                        {item.label}
                                    </motion.a>
                                ));
                            }
                            return null;
                        })
                    }
                    {
                        isAuthenticated ? (
                            <motion.button
                                onClick={handleSignOut}
                                className="text-sm font-medium hover:text-primary transition-colors"
                                whileHover={{scale: 1.1, color: "var(--primary)"}}
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.3, delay: headerElementsLength * 0.1}}
                            >
                                Déconnexion
                            </motion.button>
                        ) : (
                            <motion.a
                                href="/login"
                                className="text-sm font-medium hover:text-primary transition-colors"
                                whileHover={{scale: 1.1, color: "var(--primary)"}}
                                initial={{opacity: 0, y: -20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.3, delay: headerElementsLength * 0.1}}
                            >
                                Se connecter
                            </motion.a>
                        )
                    }
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
                            <nav className="flex flex-col md:hidden items-start gap-6">
                                {
                                    headerElements.map((headerElement) => {
                                        if (headerElement.url === pathname) {
                                            return headerElement.links.map((item, index) => {
                                                headerElementsLength = headerElement.links.length;
                                                return (
                                                        <motion.a
                                                            key={item.link}
                                                            href={item.link}
                                                            className="text-sm font-medium hover:text-primary transition-colors"
                                                            onClick={() => toggleMenu()}
                                                            initial={{opacity: 0, x: -20}}
                                                            animate={{opacity: 1, x: 0}}
                                                            transition={{duration: 0.3, delay: index * 0.1}}
                                                        >
                                                            {item.label}
                                                        </motion.a>
                                                )
                                            });
                                        }
                                        return null;
                                    })
                                }
                                {
                                    isAuthenticated ? (
                                        <motion.button
                                            onClick={handleSignOut}
                                            className="text-sm font-medium hover:text-primary transition-colors"
                                            whileHover={{scale: 1.1, color: "var(--primary)"}}
                                            initial={{opacity: 0, x: -20}}
                                            animate={{opacity: 1, x: 0}}
                                            transition={{duration: 0.3, delay: headerElementsLength * 0.1}}
                                        >
                                            Déconnexion
                                        </motion.button>
                                    ) : (
                                        <motion.a
                                            href="/login"
                                            className="text-sm font-medium hover:text-primary transition-colors"
                                            whileHover={{scale: 1.1, color: "var(--primary)"}}
                                            initial={{opacity: 0, x: -20}}
                                            animate={{opacity: 1, x: 0}}
                                            transition={{duration: 0.3, delay: headerElementsLength * 0.1}}
                                        >
                                            Se connecter
                                        </motion.a>
                                    )
                                }
                            </nav>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}