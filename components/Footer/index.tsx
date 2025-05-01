import React from 'react';
import {footer} from "@/constants/footer";
import Image from "next/image";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="pt-16 pb-32 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start mb-12">
                    {/* Section Capybook à gauche */}
                    <div className="mb-8 md:mb-0 max-w-md">
                        <div className="flex items-center gap-2 mb-4">
                            <Image
                                src={footer.iconUrl}
                                className="h-10 w-10 text-primary"
                                width="42"
                                height="42"
                                alt={footer.title}
                            />
                            <span className="text-2xl font-bold tracking-tight">{footer.title}</span>
                        </div>
                        <p className="text-md text-slate-600 dark:text-slate-300">
                            {footer.description}
                        </p>
                    </div>

                    {/* Section liens à droite */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        {footer.socialLinks.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                className="flex items-center group transition-all duration-300"
                                target={item.external ? "_blank" : "_self"}
                            >
                                <div
                                    className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm group-hover:shadow-md mr-2 transition-all duration-300 group-hover:scale-110 group-hover:text-primary">
                                    {item.icon}
                                </div>
                                <span
                                    className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors duration-300">
                                    {item.label}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>

                <div
                    className="pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 md:mb-0">
                        © {currentYear} Capybook. Tous droits réservés.
                    </p>
                    <div className="flex space-x-6">
                        {["Twitter", "LinkedIn", "Instagram"].map((social) => (
                            <a
                                key={social}
                                href="#"
                                className="text-sm text-slate-500 hover:text-primary transition-colors duration-300"
                            >
                                {social}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;