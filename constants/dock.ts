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
        imageSrc: "/dock/reviews.png",
        tooltip: "Avis",
        link: "/reviews",
        needsAuth: true,
    },
    {
        index: 4,
        imageSrc: "/dock/progress.png",
        tooltip: "Challenges",
        link: "/challenges",
        needsAuth: true,
    },
    {
        index: 5,
        imageSrc: "/dock/daily-book.png",
        tooltip: "Livre du jour",
        link: "/daily-book",
        needsAuth: true,
    },
    {
        index: 6,
        imageSrc: "/dock/book-store.png",
        tooltip: "La librairie",
        link: "/book-store",
        needsAuth: true,
    }
]