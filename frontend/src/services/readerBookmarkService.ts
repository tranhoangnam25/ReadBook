import api from "./api";
import type { ReaderBookmarkNoteRequest, ReaderBookmarkRequest, ReaderBookmarkResponse } from "../types";

export const readerBookmarkService = {
    async getBookmarks(userId: number, bookId: number): Promise<ReaderBookmarkResponse[]> {
        const res = await api.get<ReaderBookmarkResponse[]>("/reader-bookmarks", { params: { userId, bookId } });
        return res.data;
    },

    async createBookmark(request: ReaderBookmarkRequest): Promise<ReaderBookmarkResponse> {
        const res = await api.post<ReaderBookmarkResponse>("/reader-bookmarks", request);
        return res.data;
    },

    async updateNote(id: number, request: ReaderBookmarkNoteRequest): Promise<ReaderBookmarkResponse> {
        const res = await api.patch<ReaderBookmarkResponse>(`/reader-bookmarks/${id}/note`, request);
        return res.data;
    },

    async deleteBookmark(id: number): Promise<void> {
        await api.delete(`/reader-bookmarks/${id}`);
    },
};
