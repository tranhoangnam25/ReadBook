import api from './api';
import type { RegisterRequest, AuthResponse } from '../types';


export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    // Dùng api.post thay cho axios.post
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
};