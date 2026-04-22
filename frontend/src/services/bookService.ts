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
    getReadingProgress: async (userId: number, bookId: number): Promise<any> => {
        const res = await api.get(`/users/me/reading/progress`, {
            params: { userId, bookId }
        });
        return res.data;
    },
    saveReadingProgress: async (userId: number, bookId: number, cfiLocation: string, progressPercentage: number): Promise<void> => {
        await api.post(`/users/me/reading/progress`, null, {
            params: { userId, bookId, cfiLocation, progressPercentage }
        });
    }
};