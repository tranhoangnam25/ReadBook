import api from './api'; 
import type { RegisterRequest, LoginRequest, AuthResponse } from '../types';


export const getStoredUserId = () => {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    try {
        const userObj = JSON.parse(userJson);
        return userObj.id; 
    } catch {
        return null;
    }
};


export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
};
export const login = async (userData: LoginRequest): Promise<AuthResponse> => {
    
    const response = await api.post<AuthResponse>('/auth/login', userData);
    return response.data;
};

export const getCurrentUser = async () => {
    const userId = getStoredUserId();
    if (!userId) throw new Error("No userId found");

    
    const response = await api.get(`/users/${userId}`, {
        params: { id: userId }
    });
    return response.data;
};


export const updateProfile = async (data: any) => {
    const userId = getStoredUserId();
    if (!userId) throw new Error("No userId found");

    
    const response = await api.put(`/users/${userId}`, data);

    
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...response.data };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    return response.data;
};


export const changePassword = async (data: { currentPassword: string; password: string }) => {
    const userId = getStoredUserId();
    if (!userId) throw new Error("No userId found");

    
    return api.put(`/users/${userId}/change-password`, data, {
        params: { id: userId }
    });
};