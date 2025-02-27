export const formatList = (items?: string[]) => {
    if (!items || items.length === 0) return "Non disponible";
    return items.join(", ");
};