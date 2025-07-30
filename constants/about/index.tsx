import {BookOpen, CheckCircle, Star, Users} from "lucide-react";

const services = [
    {
        title: "Suivi de Lecture",
        description: "Suivez votre progression dans chaque livre avec des outils intuitifs et personnalisables.",
        icon: <BookOpen className="text-primary size-6"/>,
    },
    {
        title: "Communauté",
        description: "Rejoignez une communauté active de lecteurs et partagez vos découvertes littéraires.",
        icon: <Users className="text-primary size-6"/>,
    },
    {
        title: "Statistiques",
        description: "Analysez vos habitudes de lecture avec des statistiques détaillées et personnalisées.",
        icon: <Star className="text-primary size-6"/>,
    },
];

const faqs = [
    {
        question: "Comment fonctionne le suivi de lecture ?",
        answer: "Capybook vous permet de suivre votre progression en pourcentage. Vous pouvez définir des objectifs quotidiens ou hebdomadaires et visualiser vos statistiques de lecture en temps réel.",
    },
    {
        question: "Mes données sont-elles sécurisées ?",
        answer: "Absolument. Nous utilisons les dernières technologies de cryptage et respectons scrupuleusement le RGPD pour protéger vos données personnelles.",
    },
    {
        question: "Comment contacter le support ?",
        answer: "Notre équipe support est disponible 7j/7 par email.",
    }
];

const team = [
    {
        image: "/raphael.png",
        firstName: "Raphaël",
        lastName: "Raclot",
        role: "CEO",
        status: "Junior Full Stack Developer",
        description: " Passionné par la technologie et la lecture, Raphaël a créé Capybook pour révolutionner la façon dont nous suivons et apprécions nos lectures."
    }
]

const history = {
    image: "/about-icon.png",
    title: "Notre Histoire",
    description: "Fondée en 2025, Capybook est née d'une passion partagée pour la lecture et la technologie. " +
        "Plus précisément de Raphaël, qui lisait des livres mais n'arrivait jamais à les finir, soit car il oubliait où il en était ou par manque de temps.",
    listIcon: <CheckCircle className="text-primary mt-1 size-6"/>,
    list: [
        {
            title: "Innovation Continue",
            description: "Nous développons constamment de nouvelles fonctionnalités pour améliorer votre expérience."
        },
        {
            title: "Engagement Qualité",
            description: "Chaque fonctionnalité est méticuleusement testée pour assurer une expérience optimale."
        },
        {
            title: "Communauté Active",
            description: "Une communauté grandissante de lecteurs passionnés qui partagent leurs découvertes."
        }
    ]
}

export {
    services,
    faqs,
    team,
    history
}