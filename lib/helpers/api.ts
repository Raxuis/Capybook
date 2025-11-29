import axios from "axios";

/**
 * API client configuration
 */
export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Generic fetcher for SWR
 */
export const fetcher = async <T>(url: string): Promise<T> => {
  try {
    const res = await axios.get<T>(url);
    return res.data;
  } catch (error) {
    console.error("❌ Erreur API:", error);
    throw error;
  }
};
