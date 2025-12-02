"use client";

import {AnimatePresence, motion} from "motion/react";
import {useState, useEffect} from "react";
import {cn} from "@/lib/utils";
import {Link} from "next-view-transitions";
import {usePathname} from "next/navigation";
import {useRouter} from 'nextjs-toploader/app';
import {User} from "@prisma/client";
import {signOut, useSession} from "next-auth/react";
import Image from "next/image";
import {navigation} from "@/constants";
import {Menu, X} from "lucide-react";
import {SidebarTrigger} from "@/components/ui/sidebar";

interface ClientHeaderProps {
    user: User | null;
    adminHeader?: boolean;
}

export default function ClientHeader({user: initialUser, adminHeader = false}: ClientHeaderProps) {
    const {data: session} = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const currentUser = session?.user || initialUser;
    const currentUsername = currentUser?.username;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSignOut = async () => {
        await signOut({redirectTo: "/login"});
    };

    if (adminHeader) {
        return (
            <motion.header
                transition={{duration: 0.5, ease: "easeOut"}}
                className={cn(
                    "sticky top-0 z-50 transition-all duration-300",
                    scrolled
                        ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm py-3 sm:py-4"
                        : "bg-transparent py-3 sm:py-4"
                )}
                style={{
                    paddingTop: `max(0.75rem, env(safe-area-inset-top))`,
                }}
            >
                <div className="container mx-auto flex items-center justify-between px-4">
                    <motion.div
                        whileHover={{scale: 1.05}}
                        transition={{type: "spring", stiffness: 300}}
                        className="flex items-center gap-2"
                    >
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/icon.png"
                                className="text-primary size-10"
                                width="42"
                                height="42"
                                alt="Capybook Logo"
                            />
                            <span className="text-xl font-bold">Capybook</span>
                        </Link>
                    </motion.div>

                    <div className="flex items-center gap-4">
                        <motion.button
                            onClick={handleSignOut}
                            className="hover:text-primary text-sm font-medium transition-colors"
                            whileHover={{scale: 1.05}}
                        >
                            Déconnexion
                        </motion.button>
                        <SidebarTrigger/>
                    </div>
                </div>
            </motion.header>
        );
    }

    const {navigation: headerElements} = navigation;
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleNavigation = (link: string) => {
        setIsMenuOpen(false);

        if (link.startsWith("#")) {
            const element = document.querySelector(link);
            if (element) {
                element.scrollIntoView({behavior: "smooth"});
            }
            return;
        }

        setTimeout(() => {
            router.push(link);
        }, 100);
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
                        className="hover:text-primary text-sm font-medium transition-colors"
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
                            onClick={() => {
                                setIsMenuOpen(false);
                                router.push(`/profile/@${currentUsername}`);
                            }}
                            className="hover:text-primary text-center text-sm font-medium transition-colors"
                            whileHover={{scale: 1.05}}
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{...transitionBase, delay: links.length * 0.1}}
                        >
                            Mon profil
                        </motion.button>
                        {
                            (currentUser?.role && currentUser?.role === "ADMIN") && (
                                <motion.button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        router.push("/admin");
                                    }}
                                    className="hover:text-primary text-center text-sm font-medium transition-colors"
                                    whileHover={{scale: 1.05}}
                                    initial={{opacity: 0, x: -20}}
                                    animate={{opacity: 1, x: 0}}
                                    transition={{...transitionBase, delay: links.length * 0.1}}
                                >
                                    Admin
                                </motion.button>
                            )
                        }
                        <motion.button
                            onClick={handleSignOut}
                            className="hover:text-primary text-sm font-medium transition-colors"
                            whileHover={{scale: 1.05}}
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{...transitionBase, delay: links.length * 0.1}}
                        >
                            Déconnexion
                        </motion.button>
                    </>
                ) : (
                    <motion.a
                        href="/login"
                        className="hover:text-primary text-sm font-medium transition-colors"
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
                    ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm py-3 sm:py-4"
                    : "bg-transparent py-3 sm:py-4"
            )}
            style={{
                paddingTop: `max(0.75rem, env(safe-area-inset-top))`,
            }}
        >
            <div className="container mx-auto flex items-center justify-between px-4">
                <motion.div whileHover={{scale: 1.05}} transition={{type: "spring", stiffness: 300}}>
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/icon.png"
                            className="text-primary size-10"
                            width="42"
                            height="42"
                            alt="Capybook Logo"
                        />
                        <span className="text-xl font-bold">Capybook</span>
                    </Link>
                </motion.div>

                <button
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center p-2 md:hidden"
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                >
                    {isMenuOpen ? <X className="size-6"/> : <Menu className="size-6"/>}
                </button>

                <nav className="hidden items-center gap-6 md:flex">
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
                        className="bg-background absolute w-full origin-top border-b p-4 shadow-lg md:hidden"
                    >
                        <nav className="flex flex-col gap-4 text-center">{renderNavButtons()}</nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
