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

export const getStoredUserId = () => {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    try {
        const userObj = JSON.parse(userJson);
        return userObj.id || userObj.userId; // Tùy vào backend trả về field nào
    } catch (e) {
        return null;
    }
};

export const getCurrentUser = async () => {
    const token = localStorage.getItem('token');
    const userId = getStoredUserId();

    if (!token || !userId) {
        throw new Error("No token or userId found");
    }

    const response = await axios.get(`${API_URL}/users/me?id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    return response.data; // Thường trả về { id, username, email, ... }
};

interface UpdateUserData {
    username: string;
    phone?: string;
    password?: string;
}

export const updateProfile = async (userData: UpdateUserData) => {
    const token = localStorage.getItem('token');

    const userId = getStoredUserId();

    if (!token || !userId) throw new Error("Missing Auth info");

    const response = await axios.put(
        `${API_URL}/users/me/update/${userId}`,
        userData,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );

    return response.data;
};

export const changePassword = async (data: any) => {
    // API này sẽ nhận: currentPassword, newPassword
    const response = await axios.post('/api/users/me/change-password', data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

