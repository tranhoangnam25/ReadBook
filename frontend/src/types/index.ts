export interface BookResponse {
    id: number
    title: string
    description: string
    authorName: string
    price: number
    previewPercentage: number
    coverImage: string
    fileUrl: string
    category: string
    publishYear: number
    createdAt: Date
    updatedAt: Date
    averageRating?: number
}
export interface RegisterRequest {
    username?: string;
    email: string;
    password: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface AuthResponse {

    success: boolean;
    message: string;
    token?: string;
    user?: {
        id: number;
        username: string;
        email: string;
    };
}
/* cspell:disable */
export interface User {
    id: number;
    username: string;
    email?: string;
    phone?: string;
}

export interface Book {
    id: number;
    title: string;
    author: string;
    coverUrl: string;
}

export interface Reading {
    id: number;
    title: string;     // Thêm trường này
    author: string;    // Thêm trường này
    coverUrl: string;  // Thêm trường này
    currentPage: number; // Thêm trường này
    totalPages: number;
    progress: number;
}

export interface HistoryItem {
    id: number;
    title: string;      // Thêm trường này
    finishedAt: string;
}

