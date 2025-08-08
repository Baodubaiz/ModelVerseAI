import api from '@/lib/axios';
import { Transaction_VND } from '@/types/index';

export const createVNDTx = (data: Partial<Transaction_VND>) => api.post('/transaction_vnd', data);
export const getVNDTxByUser = (userId: string) => api.get(`/transaction_vnd/user/${userId}`);
