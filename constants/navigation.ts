type NavigationOptions = {
    page: string;
    url: string;
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
    }
]

export {
    navigation
}