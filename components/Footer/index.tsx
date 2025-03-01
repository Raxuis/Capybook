import React from 'react';
import {motion} from "motion/react";
import {BookOpen} from "lucide-react";

const Footer = () => {
    return (
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
    );
};

export default Footer;
