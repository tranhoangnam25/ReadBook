import api from "./api";
import type { BookResponse } from "../types";

export const bookService = {

    getBestRatings: async (limit = 4): Promise<BookResponse[]> => {
        const res = await api.get<BookResponse[]>("/books/bestRatings", {
            params: { limit },
        });
        return res.data;
    },
    getBookById: async (id: number): Promise<BookResponse> => {
        const res = await api.get<BookResponse>(`/books/${id}`
        );
        return res.data;
    },
};