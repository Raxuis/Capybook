type NavigationOptions = {
    page: string;
    url: string;
    needsAuth?: boolean;
    links: {
        label: string;
        link: string;
    }[];
}[];


const navigation: NavigationOptions = [
    {
        page: "Accueil",
        url: "/",
        links: [
            {
                label: "Accueil",
                link: "#",
            },
            {
                label: "Fonctionnalités",
                link: "#fonctionnalités",
            },
            {
                label: "Témoignages",
                link: "#témoignages",
            }
        ]
    },
    {
        page: "À propos",
        url: "/about",
        links: [
            {
                label: "À propos",
                link: "#",
            },
            {
                label: "Histoire",
                link: "#history",
            },
            {
                label: "Services",
                link: "#services",
            },
            {
                label: "Équipe",
                link: "#team",
            },
            {
                label: "FAQ",
                link: "#faq",
            }
        ]
    },
]

export {
    navigation
}