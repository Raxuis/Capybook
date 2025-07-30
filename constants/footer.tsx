import {BookOpen, Github, Heart, Mail} from "lucide-react";
import React from "react";

type Footer = {
    title: string;
    description: string;
    iconUrl: string;
    links: {
        icon: React.ReactNode;
        label: string;
        href: string;
        external?: boolean;
        isAvailable?: boolean;
    }[];
    socialNetworksLinks: {
        type: "Twitter" | "LinkedIn" | "Instagram",
        url: string;
        isAvailable?: boolean;
    }[]
}

export const footer: Footer = {
    title: "Capybook",
    description: "Transformez votre expérience de lecture avec notre application de suivi et d'analyse littéraire.",
    iconUrl: "/icon.png",
    links: [
        {icon: <Heart className="size-5"/>, label: "Notre mission", href: "/about"},
        {icon: <Mail className="size-5"/>, label: "Contact", href: "/contact", isAvailable: false},
        {
            icon: <Github className="size-5"/>,
            label: "Open Source",
            href: "https://github.com/Raxuis/Capybook",
            external: true
        },
        {icon: <BookOpen className="size-5"/>, label: "Blog", href: "/blog", isAvailable: false}
    ],
    socialNetworksLinks: [
        {
            type: "LinkedIn",
            url: "",
            isAvailable: false,
        }
    ]
}