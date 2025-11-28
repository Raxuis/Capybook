import axios from 'axios';

export const fetcher = async <T>(url: string): Promise<T> => {
    try {
        const res = await axios.get<T>(url);
        return res.data;
    } catch (error) {
        console.error("❌ Erreur API:", error);
        throw error;
    }
};
