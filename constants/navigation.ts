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
                label: "Blog",
                link: "#blog",
            },
            {
                label: "Carrières",
                link: "#carrières",
            }
        ]
    },
]

export {
    navigation
}