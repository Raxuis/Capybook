export type SearchType = 'general' | 'isbn';

export type OpenLibraryISBNBook = {
    title: string;
    authors?: { name: string; url: string }[];
    publish_date?: string;
    cover?: {
        small?: string;
        medium?: string;
        large?: string;
    };
    languages?: { key: string }[];
};


export type MoreInfoBook = Book & {
    description?: string;
    subjects: string[];
    cover?: string;
    finishedAt?: string | null;
    numberOfPages?: number;
}

export type Book = {
    id: string;
    key: string;
    title: string;
    cover_i?: number;
    cover?: string;
    author_name?: string[];
    first_publish_year?: number;
    language?: string[];
    authors?: string[];
    isbn?: string[];
};
