export const navigation = [
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

interface Testimonial {
    id: number;
    name: string;
    avatar: string;
    rating: number;
    content: string;
    time: string;
    gender: "male" | "female" | "other";
}


export const testimonials: Testimonial[] = [
    {
        id: 1,
        name:
            "Thomas Dubois",
        avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        rating:
            5,
        content:
            "Depuis que j'utilise LivreTrack, je lis deux fois plus qu'avant. Les statistiques me motivent vraiment à atteindre mes objectifs de lecture.",
        time: "8mois",
        gender: "male"
    },
    {
        id: 2,
        name:
            "Julie Moreau",
        avatar:
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        rating:
            4,
        content:
            "Excellente application pour les lecteurs passionnés. J'adore pouvoir organiser ma bibliothèque et suivre ma progression.",
        time: "3mois",
        gender: "female"
    },
    {
        id: 3,
        name:
            "Marc Lefevre",
        avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        rating:
            5,
        content:
            "Interface intuitive et fonctionnalités complètes. LivreTrack est devenu mon compagnon de lecture au quotidien.",
        time: "5mois",
        gender: "male"
    },
    {
        id: 4,
        name:
            "Emma Bernard",
        avatar:
            "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        rating:
            5,
        content:
            "Pratique pour suivre les livres lus et à lire. Je recommande vivement pour tous les amoureux de littérature !",
        time: "2ans",
        gender: "female"
    }
];