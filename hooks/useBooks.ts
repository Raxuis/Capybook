import {fetcher} from "@/utils/fetcher";
import useSWR from "swr";
import {useDebounce} from "@uidotdev/usehooks";

export type Book = {
    key: string;
    title: string;
    cover_i?: number;
    author_name?: string[];
    first_publish_year?: number;
    language?: string[];
};

type OpenLibraryResponse = {
    docs: Book[];
};

export function useBooks(bookName: string | null) {
    const debouncedBookName = useDebounce(bookName, 500);

    const {data, error, isLoading} = useSWR<OpenLibraryResponse>(
        debouncedBookName
            ? `https://openlibrary.org/search.json?q=${debouncedBookName}&limit=10`
            : null,
        fetcher
    );

    return {
        books: data?.docs || [],
        isLoading,
        isError: !!error,
    };
}
