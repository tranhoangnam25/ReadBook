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
    title: string;     
    author: string;    
    coverUrl: string;  
    currentPage: number; 
    totalPages: number;
    progress: number;
}

export interface HistoryItem {
    id: number;
    title: string;      
    finishedAt: string;
}


export interface TocItem {
    label: string;
    href: string;
    subitems?: TocItem[];
}

// Enum IDs matching Java backend BackgroundColor and FontFamily enums
export type FontFamilyId = "DEFAULT" | "SERIF" | "SANS_SERIF" | "MONO" | "TIMES_NEW_ROMAN";
export type BackgroundColorId = "WHITE" | "CREAM" | "LIGHT_BLUE" | "LIGHT_YELLOW" | "LIGHT_GRAY" | "DARK" | "BLACK";

export interface ReaderSettingResponse {
    fontFamily: FontFamilyId;
    fontSize: number;
    lineHeight: number;
    backgroundColor: BackgroundColorId;
}

export interface ReaderSettingRequest {
    userId: number;
    fontFamily: FontFamilyId;
    fontSize: number;
    lineHeight: number;
    backgroundColor: BackgroundColorId;
}
