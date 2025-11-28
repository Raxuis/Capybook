import {Globe, Lock, UserCheck, Users} from "lucide-react";

export const getPrivacyConfig = (privacy: string) => {
    switch (privacy) {
        case "PUBLIC":
            return {
                label: "Publique",
                icon: Globe,
                variant: "default" as const,
                className: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400",
                description: "Visible par tous les utilisateurs",
            };
        case "FRIENDS":
            return {
                label: "Amis",
                icon: Users,
                variant: "secondary" as const,
                className: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
                description: "Visible par tous vos amis",
            };
        case "SPECIFIC_FRIEND":
            return {
                label: "Ami spécifique",
                icon: UserCheck,
                variant: "secondary" as const,
                className: "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400",
                description: "Visible uniquement par un ami spécifique",
            };
        case "PRIVATE":
            return {
                label: "Privé",
                icon: Lock,
                variant: "outline" as const,
                className: "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900/20 dark:text-gray-400",
                description: "Accessible uniquement par lien privé",
            };
        default:
            return {
                label: "Publique",
                icon: Globe,
                variant: "default" as const,
                className: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400",
                description: "Visible par tous les utilisateurs",
            };
    }
};