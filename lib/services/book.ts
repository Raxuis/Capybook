import axios from "axios";
import { MoreInfoBook } from "@/types";

/**
 * Book service - handles external API calls and book data operations
 */

type MoreInfoAPIResponse = {
  data: MoreInfoBook;
};

/**
 * Fetch detailed book information from Open Library
 */
export async function fetchMoreBookInfos(bookKey: string): Promise<MoreInfoBook | { error: string }> {
  try {
    const response: MoreInfoAPIResponse = await getBook(bookKey);
    response.data.numberOfPages = await getNumberOfPages(bookKey);
    return response.data;
  } catch (err) {
    console.error("Erreur lors de la récupération des infos du livre :", err);

    if (axios.isAxiosError(err)) {
      return err.response?.data || { error: "Impossible de récupérer les infos du livre." };
    }

    return { error: "Une erreur inconnue est survenue." };
  }
}

/**
 * Get book data from Open Library
 */
export async function getBook(bookKey: string): Promise<MoreInfoAPIResponse> {
  try {
    const response = await axios.get(`https://openlibrary.org${bookKey}.json`);
    return { data: response.data };
  } catch (err) {
    console.error("Error retrieving book:", err);
    return { data: {} as MoreInfoBook };
  }
}

/**
 * Get number of pages for a book
 */
export async function getNumberOfPages(bookKey: string): Promise<number | null> {
  try {
    const editions = await getBookEditions(bookKey);
    for (const edition of editions) {
      if (edition.number_of_pages) {
        return edition.number_of_pages;
      }
    }
    return null;
  } catch (err) {
    console.error("Error retrieving number of pages:", err);
    return null;
  }
}

/**
 * Get all editions for a book
 */
export async function getBookEditions(bookKey: string): Promise<Array<{ number_of_pages?: number }>> {
  try {
    const response = await axios.get(`https://openlibrary.org${bookKey}/editions.json`);
    return response.data.entries;
  } catch (err) {
    console.error("Error retrieving editions:", err);
    return [];
  }
}
