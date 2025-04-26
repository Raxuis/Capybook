interface DockRoute {
    index: number;
    imageSrc: string;
    tooltip: string;
    withoutBackground?: boolean;
    link: string;
}

export const dockRoutes: DockRoute[] = [
    {
        index: 0,
        imageSrc: "/home.png",
        tooltip: "Accueil",
        withoutBackground: true,
        link: "/"
    },
    {
        index: 1,
        imageSrc: "/about.png",
        tooltip: "À propos",
        link: "/about",
        withoutBackground: true,
    },
    {
        index: 2,
        imageSrc: "/book-shelf.png",
        tooltip: "Votre bibliothèque",
        link: "/book-shelf"
    },
    {
        index: 3,
        imageSrc: "/reviews.png",
        tooltip: "Avis",
        withoutBackground: true,
        link: "/reviews"
    },
    {
        index: 4,
        imageSrc: "/challenges.png",
        tooltip: "Challenges",
        withoutBackground: true,
        link: "/challenges"
    },
    {
        index: 5,
        imageSrc: "/book-store.png",
        tooltip: "La librairie",
        link: "/book-store",
        withoutBackground: true,
    }
]