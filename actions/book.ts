import axios, {AxiosError} from "axios";

export async function fetchMoreBookInfos(bookKey: string) {
    try {
        const response = await axios.get(`https://openlibrary.org${bookKey}.json`);
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            return err.response?.data;
        }
    }
}