import api from './api';
import type { RegisterRequest,LoginRequest, AuthResponse } from '../types';



export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    // Dùng api.post thay cho axios.post
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
};
export const login = async (userData: LoginRequest): Promise<AuthResponse> => {
    // Dùng api.post thay cho axios.post
    const response = await api.post<AuthResponse>('/auth/login', userData);
    return response.data;
};