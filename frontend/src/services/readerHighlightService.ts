import api from "./api";
import type { ReaderHighlightNoteRequest, ReaderHighlightRequest, ReaderHighlightResponse } from "../types";

export const readerHighlightService = {
    async getHighlights(userId: number, bookId: number): Promise<ReaderHighlightResponse[]> {
        const res = await api.get<ReaderHighlightResponse[]>("/reader-highlights", { params: { userId, bookId } });
        return res.data;
    },

    async createHighlight(request: ReaderHighlightRequest): Promise<ReaderHighlightResponse> {
        const res = await api.post<ReaderHighlightResponse>("/reader-highlights", request);
        return res.data;
    },

    async updateNote(id: number, request: ReaderHighlightNoteRequest): Promise<ReaderHighlightResponse> {
        const res = await api.patch<ReaderHighlightResponse>(`/reader-highlights/${id}/note`, request);
        return res.data;
    },

    async deleteHighlight(id: number): Promise<void> {
        await api.delete(`/reader-highlights/${id}`);
    },
};
