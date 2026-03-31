import api from './api';
import type { RegisterRequest,LoginRequest, AuthResponse } from '../types';

import axios from 'axios';
const API_URL = '/api';

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
export const getCurrentUser = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error("No token found");
    }

    const response = await axios.get(`${API_URL}/users/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data; // Thường trả về { id, username, email, ... }
};
export const updateProfile = async (userData: { fullName: string; email: string }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error("No token found");
    }

    const response = await axios.put(`${API_URL}/users/update`, userData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};