import api from "./api";
import type { ReaderSettingResponse, ReaderSettingRequest } from "../types";

export const readerSettingService = {
    getReaderSettings: async (userId: number): Promise<ReaderSettingResponse | null> => {
        try {
            const res = await api.get<ReaderSettingResponse>("/reader-settings", {
                params: { userId }
            });
            return res.data;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    },

    saveReaderSettings: async (request: ReaderSettingRequest): Promise<ReaderSettingResponse> => {
        const res = await api.post<ReaderSettingResponse>("/reader-settings", request);
        return res.data;
    }
};
