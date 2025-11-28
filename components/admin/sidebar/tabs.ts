import {Book, Users, Target, BadgePercent, Layers3} from "lucide-react"

export const tabs = [
    {
        title: "Utilisateurs",
        url: "/admin/users",
        icon: Users,
    },
    {
        title: "Livres",
        url: "/admin/books",
        icon: Book,
    },
    {
        title: "Genres",
        url: "/admin/genres",
        icon: Layers3,
    },
    {
        title: "Badges",
        url: "/admin/badges",
        icon: BadgePercent,
    },
    {
        title: "Objectifs",
        url: "/admin/goals",
        icon: Target,
    }
]
