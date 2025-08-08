// src/services/auth.ts

import api from '@/lib/axios';
import { LoginInput, RegisterInput } from '@/types/index';

export const login = async (data: LoginInput) => {
    const res = await api.post('/login', data);
    const token = res.data.accessToken;

    if (token) {
        localStorage.setItem('accessToken', token); // lưu token
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // gắn sẵn header
    }

    return res.data;
};

export const register = (data: RegisterInput) => api.post('/register', data);

export const logout = () => {
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.common['Authorization'];
    return Promise.resolve();
};
