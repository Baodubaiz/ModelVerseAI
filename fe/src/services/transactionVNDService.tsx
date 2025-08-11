import api from '@/lib/axios';
import { Transaction_VND } from '@/types/index';

export const createVNDTx = (data: Partial<Transaction_VND>) => api.post('/transaction_vnd', data);
export const getVNDTx = () => api.get<Transaction_VND[]>('/transaction_vnd');
export const getVNDTxById = (id: string) => api.get<Transaction_VND>(`/transaction_vnd/${id}`);
export const updateVNDTx = (id: string, data: Partial<Transaction_VND>) => api.put(`/transaction_vnd/${id}`, data);
export const deleteVNDTx = (id: string) => api.delete(`/transaction_vnd/${id}`);

// Lấy tất cả giao dịch theo người dùng
export const getVNDTxByUserId = (userId: string) => api.get(`/transaction_vnd/user/${userId}`);
