import {BookOpen, BookMarked, BarChart2, Heart} from "lucide-react";

const features = [
    {
        key: "add",
        label: "Ajouter",
        title: "Ajoutez vos livres en un instant",
        description:
            "Recherchez et ajoutez vos livres en quelques clics grâce à notre base de données étendue.",
        icon: <BookOpen className="text-primary size-8"/>,
        points: [
            "Recherche par ISBN",
            "Recherche par Titre",
            "Recherche par Auteur",
        ],
        image: "/landing-page/search.webp",
    },
    {
        key: "track",
        label: "Progression",
        title: "Suivez votre progression",
        description:
            "Marquez votre progression en pages ou en pourcentage et définissez des objectifs de lecture quotidiens ou hebdomadaires.",
        icon: <BookMarked className="text-secondary size-8"/>,
        points: [
            "Suivi par page ou pourcentage",
            "Objectifs personnalisables",
            "Rappels de lecture",
        ],
        image: "/landing-page/progress.webp",
    },
    {
        key: "stats",
        label: "Statistiques",
        title: "Analysez vos statistiques",
        description:
            "Visualisez vos habitudes de lecture avec des graphiques détaillés et découvrez vos genres préférés.",
        icon: <BarChart2 className="text-accent size-8"/>,
        points: [
            "Graphiques de progression",
            "Analyse par genre et auteur",
            "Comparaison avec vos objectifs",
        ],
        image: "/landing-page/stats.webp",
    },
    {
        key: "favorites",
        label: "Favoris",
        title: "Gérez vos favoris",
        description:
            "Organisez votre bibliothèque avec des collections personnalisées et partagez vos recommandations avec vos amis.",
        icon: <Heart className="text-destructive size-8"/>,
        points: [
            "Collections personnalisées",
            "Partage de recommandations",
            "Notes et critiques privées",
        ],
        image: "/landing-page/favorites.webp",
    },
];


export {
    features
}