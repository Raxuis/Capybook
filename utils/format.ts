import {BookNoteType} from "@prisma/client";

export const formatList = (items?: string[]) => {
    if (!items || items.length === 0) return "Non disponible";
    return items.join(", ");
};

export const formatUsername = (username: string) => {
    return username.replace(/@|%40/g, "");
}

export const formatUrlParam = (param: string) => {
    return decodeURIComponent(param);
}

export const formatBadgeCategory = (category: string) => {
    switch (category) {
        case "BOOKS_READ":
            return "Livres lus";
        case "PAGES_READ":
            return "Pages lues";
        case "GOALS_COMPLETED":
            return "Objectifs atteints";
        case "REVIEWS_WRITTEN":
            return "Critiques écrites";
        default:
            return category;
    }
}

export const formatBookNoteType = (bookNoteType: BookNoteType) => {
    switch (bookNoteType) {
        case BookNoteType.QUOTE:
            return "Citation";
        case BookNoteType.THOUGHT:
            return "Pensée";
        case BookNoteType.SUMMARY:
            return "Résumé";
        default:
            return "Note";
    }
}