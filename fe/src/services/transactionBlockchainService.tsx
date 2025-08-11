import api from '@/lib/axios';
import { Transaction_Blockchain } from '@/types/index';

export const createBlockchainTx = (data: Partial<Transaction_Blockchain>) => api.post('/transaction_blockchain', data);
export const getBlockchainsTx = () => api.get<Transaction_Blockchain[]>('/transaction_blockchain');
export const getBlockchainByIdTx = (id: string) => api.get<Transaction_Blockchain>(`/transaction_blockchain/${id}`);
export const updateBlockchainTx = (id: string, data: Partial<Transaction_Blockchain>) => api.put(`/transaction_blockchain/${id}`, data);
export const deleteBlockchainTx = (id: string) => api.delete(`/transaction_blockchain/${id}`);

// Lấy tất cả giao dịch theo người dùng
export const getBlockchainsTxByUserId = (userId: string) => api.get(`/transaction_blockchain/user/${userId}`);
