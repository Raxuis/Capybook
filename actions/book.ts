import axios from "axios";

export async function fetchMoreBookInfos(bookKey: string) {
    try {
        const response = await axios.get(`https://openlibrary.org${bookKey}.json`);
        return response.data;
    } catch (err) {
        console.error("Erreur lors de la récupération des infos du livre :", err);

        if (axios.isAxiosError(err)) {
            return err.response?.data || { error: "Impossible de récupérer les infos du livre." };
        }

        return { error: "Une erreur inconnue est survenue." };
    }
}
