import {BookOpen, Github, Heart, Mail} from "lucide-react";
import React from "react";

type Footer = {
    title: string;
    description: string;
    iconUrl: string;
    socialLinks: {
        icon: React.ReactNode;
        label: string;
        href: string;
        external?: boolean;
    }[];
}

export const footer: Footer = {
    title: "LivreTrack",
    description: "Transformez votre expérience de lecture avec notre application de suivi et d'analyse littéraire.",
    iconUrl: "/icon.png",
    socialLinks: [
        {icon: <Heart className="h-5 w-5"/>, label: "Notre mission", href: "/about"},
        {icon: <Mail className="h-5 w-5"/>, label: "Contact", href: "/contact"},
        {
            icon: <Github className="h-5 w-5"/>,
            label: "Open Source",
            href: "https://github.com/Raxuis/LivreTrack",
            external: true
        },
        {icon: <BookOpen className="h-5 w-5"/>, label: "Blog", href: "/blog"}
    ],
}