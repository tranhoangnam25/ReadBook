export interface BookResponse {
    id: number
    title: string
    description: string
    authorName: string
    price: number
    previewPercentage: number
    coverImage: string
    category: string
    publishYear: number
    createdAt: Date
    updatedAt: Date
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
    token?: string; // THÊM DÒNG NÀY (dấu ? nghĩa là có thể có hoặc không)
    user?: {
        id: number;
        username: string;
        email: string;
    };
}

