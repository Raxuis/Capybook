"use client";

import {Menu, X} from "lucide-react";
import {AnimatePresence, motion} from "motion/react";
import {useState, useEffect} from "react";
import {navigation} from "@/constants";
import {cn} from "@/lib/utils";
import {Link} from "next-view-transitions";
import {usePathname, useRouter} from "next/navigation";
import {User} from "@prisma/client";
import {signOut, useSession} from "next-auth/react";
import Image from "next/image";

interface ClientHeaderProps {
    user: User | null;
}

export default function ClientHeader({user: initialUser}: ClientHeaderProps) {
    const {data: session} = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const {navigation: headerElements} = navigation;
    const pathname = usePathname();
    const router = useRouter();

    const currentUsername = session?.user?.username || initialUser?.username;

    const handleNavigation = (link: string) => {
        setIsMenuOpen(false);
        setTimeout(() => {
            router.push(link);
        }, 100);
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleSignOut = async () => {
        await signOut({redirectTo: "/login"});
    };

    const renderNavButtons = () => {
        const currentNav = headerElements.find((el) => el.url === pathname);
        const links = currentNav?.links || [];
        const transitionBase = {duration: 0.3};

        return (
            <>
                {links.map((item, index) => (
                    <motion.button
                        key={item.link}
                        onClick={() => handleNavigation(item.link)}
                        className="text-sm font-medium hover:text-primary transition-colors"
                        whileHover={{scale: 1.05}}
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{...transitionBase, delay: index * 0.1}}
                    >
                        {item.label}
                    </motion.button>
                ))}
                {currentUsername ? (
                    <>
                        <motion.button
                            onClick={handleSignOut}
                            className="text-sm font-medium hover:text-primary transition-colors"
                            whileHover={{scale: 1.05}}
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{...transitionBase, delay: links.length * 0.1}}
                        >
                            Déconnexion
                        </motion.button>
                        <motion.button
                            onClick={() => {
                                setIsMenuOpen(false);
                                router.push(`/profile/@${currentUsername}`);
                            }}
                            className="text-sm font-medium hover:text-primary transition-colors text-center"
                            whileHover={{scale: 1.05}}
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{...transitionBase, delay: links.length * 0.1}}
                        >
                            Mon profil
                        </motion.button>
                    </>
                ) : (
                    <motion.a
                        href="/login"
                        className="text-sm font-medium hover:text-primary transition-colors"
                        whileHover={{scale: 1.05}}
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{...transitionBase, delay: links.length * 0.1}}
                    >
                        Se connecter
                    </motion.a>
                )}
            </>
        );
    };

    return (
        <motion.header
            transition={{duration: 0.5, ease: "easeOut"}}
            className={cn(
                "sticky top-0 z-50 transition-all duration-300",
                scrolled
                    ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm py-4"
                    : "bg-transparent py-4"
            )}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                <motion.div whileHover={{scale: 1.05}} transition={{type: "spring", stiffness: 300}}>
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/icon.png"
                            className="h-10 w-10 text-primary"
                            width="42"
                            height="42"
                            alt="Capybook Logo"
                        />
                        <span className="text-xl font-bold">Capybook</span>
                    </Link>
                </motion.div>

                <button
                    className="md:hidden p-2"
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                >
                    {isMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
                </button>

                <nav className="hidden md:flex items-center gap-6">
                    {renderNavButtons()}
                </nav>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{scaleY: 0, opacity: 0}}
                        animate={{scaleY: 1, opacity: 1}}
                        exit={{scaleY: 0, opacity: 0}}
                        transition={{duration: 0.2, ease: "easeOut"}}
                        className="md:hidden absolute w-full bg-background border-b py-4 px-4 shadow-lg origin-top"
                    >
                        <nav className="flex flex-col gap-4 text-center">{renderNavButtons()}</nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
