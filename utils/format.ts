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