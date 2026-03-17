export interface BookResponse {
    id: number
    title: string
    description: string
    authorName: string
    price: number
    previewPercentage: number
    coverImage: string
    categories: string
    publishYear: number
    createdAt: Date
    updatedAt: Date
}
export interface RegisterRequest {
    username?: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
}

