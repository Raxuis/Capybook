export const formatList = (items?: string[]) => {
    if (!items || items.length === 0) return "Non disponible";
    return items.join(", ");
};

export const formatUsername = (username: string) => {
    return username.replace(/@/g, "");
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