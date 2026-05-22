import api from './api';

export type UploadType = 'cover' | 'book';

export interface FileUploadResponse {
    url: string;
    key: string;
    fileName: string;
    contentType: string;
    size: number;
}

export async function uploadFileToR2(file: File, type: UploadType): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await api.post<FileUploadResponse>('/uploads', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        timeout: 120000,
    });

    return response.data;
}
