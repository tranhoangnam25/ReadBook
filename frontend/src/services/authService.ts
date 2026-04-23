import api from './api'; // Đảm bảo import biến api từ file config axios
import type { RegisterRequest, LoginRequest, AuthResponse } from '../types';

// Hàm lấy ID từ localStorage (giả định bạn lưu trong object 'user')
export const getStoredUserId = () => {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    try {
        const userObj = JSON.parse(userJson);
        return userObj.id; // Backend dùng Long id, nên ở đây lấy .id
    } catch {
        return null;
    }
};


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
// 1. Lấy thông tin User
export const getCurrentUser = async () => {
    const userId = getStoredUserId();
    if (!userId) throw new Error("No userId found");

    // Backend đang dùng @RequestParam nên phải truyền query string (?id=...)
    const response = await api.get(`/users/${userId}`, {
        params: { id: userId }
    });
    return response.data;
};

// 2. Cập nhật Profile
export const updateProfile = async (data: any) => {
    const userId = getStoredUserId();
    if (!userId) throw new Error("No userId found");

    // Gửi request PUT đến /api/users/{id}
    const response = await api.put(`/users/${userId}`, data);

    // CẬP NHẬT LOCALSTORAGE: Để giao diện đồng bộ ngay lập tức
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...response.data };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    return response.data;
};

// 3. Đổi mật khẩu
export const changePassword = async (data: { currentPassword: string; password: string }) => {
    const userId = getStoredUserId();
    if (!userId) throw new Error("No userId found");

    // Khớp với Backend: /api/users/{id}/change-password?id={id}
    return api.put(`/users/${userId}/change-password`, data, {
        params: { id: userId }
    });
};