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


export const register = async (userData: RegisterRequest): Promise<{success: boolean, message: string}> => {
    const response = await api.post<any>('/auth/register', userData);
    return response.data;
};

export const verifyEmail = async (data: { email: string, otp: string }): Promise<{success: boolean, message: string}> => {
    const response = await api.post<any>('/auth/verify-email', data);
    return response.data;
};

export const socialLogin = async (data: { provider: string, token: string }): Promise<AuthResponse> => {
    const response = await api.post<any>('/auth/social-login', data);
    return response.data.data;
};

export const login = async (userData: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<any>('/auth/login', userData);
    return response.data.data;
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

    
    const response = await api.put(`/users/update`, data);

    
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...response.data };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    return response.data;
};


export const changePassword = async (data: { currentPassword: string; password: string }) => {
    const userId = getStoredUserId();
    if (!userId) throw new Error("No userId found");

    
    return api.put(`/users/change-password`, data, {
        params: { id: userId }
    });
};

export const hasPermission = (permissionName : string): boolean => {
    const userJson = localStorage.getItem('user');
    if(!userJson) return false;
    try {
        const user  = JSON.parse(userJson);
        const roles = user.roles || [];

        const userPermissions = roles.flatMap((role: any) =>
            role.permissions ? role.permissions.map((p:any) => p.name) : []
        );
        return userPermissions.includes(permissionName);
    } catch{
        return false;
    }
};

export const hasRole = (roleName: string): boolean => {
    const userJson = localStorage.getItem('user');
    if(!userJson) return false;
    try{
        const user = JSON.parse(userJson);
        return (user.roles || []).some((r:any) => r.name === roleName);
    } catch {
        return false;
    }
};