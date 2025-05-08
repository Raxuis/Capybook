interface DockRoute {
    index: number;
    imageSrc: string;
    tooltip: string;
    withoutBackground?: boolean;
    link: string;
    needsAuth?: boolean;
    isAdmin?: boolean;
}

export const dockRoutes: DockRoute[] = [
    {
        index: 0,
        imageSrc: "/dock/home.png",
        tooltip: "Accueil",
        link: "/"
    },
    {
        index: 1,
        imageSrc: "/dock/about.png",
        tooltip: "À propos",
        link: "/about",
    },
    {
        index: 2,
        imageSrc: "/dock/book-shelf.png",
        tooltip: "Votre bibliothèque",
        link: "/book-shelf",
        needsAuth: true,
    },
    {
        index: 3,
        imageSrc: "/reviews.png",
        tooltip: "Avis",
        withoutBackground: true,
        link: "/reviews",
        needsAuth: true,
    },
    {
        index: 4,
        imageSrc: "/challenges.png",
        tooltip: "Challenges",
        withoutBackground: true,
        link: "/challenges",
        needsAuth: true,
    },
    {
        index: 5,
        imageSrc: "/dock/book-store.png",
        tooltip: "La librairie",
        link: "/book-store",
        withoutBackground: true,
        needsAuth: true,
    }
]