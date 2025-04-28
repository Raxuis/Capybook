import {BookOpen, BookMarked, BarChart2, Heart} from "lucide-react";

const features = [
    {
        key: "add",
        title: "Ajoutez vos livres en un instant",
        description:
            "Recherchez et ajoutez vos livres en quelques clics grâce à notre base de données étendue.",
        icon: <BookOpen className="h-8 w-8 text-primary"/>,
        points: [
            "Recherche par ISBN",
            "Recherche par Titre",
            "Recherche par Auteur",
        ],
        image: "/landing-page/search.webp",
    },
    {
        key: "track",
        title: "Suivez votre progression",
        description:
            "Marquez votre progression en pages ou en pourcentage et définissez des objectifs de lecture quotidiens ou hebdomadaires.",
        icon: <BookMarked className="h-8 w-8 text-secondary"/>,
        points: [
            "Suivi par page ou pourcentage",
            "Objectifs personnalisables",
            "Rappels de lecture",
        ],
        image: "/landing-page/progress.webp",
    },
    {
        key: "stats",
        title: "Analysez vos statistiques",
        description:
            "Visualisez vos habitudes de lecture avec des graphiques détaillés et découvrez vos genres préférés.",
        icon: <BarChart2 className="h-8 w-8 text-accent"/>,
        points: [
            "Graphiques de progression",
            "Analyse par genre et auteur",
            "Comparaison avec vos objectifs",
        ],
        image: "/landing-page/stats.webp",
    },
    {
        key: "favorites",
        title: "Gérez vos favoris",
        description:
            "Organisez votre bibliothèque avec des collections personnalisées et partagez vos recommandations avec vos amis.",
        icon: <Heart className="h-8 w-8 text-destructive"/>,
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