import api from '@/lib/axios';
import { Transaction_Blockchain } from '@/types/index';

export const createBlockchainTx = (data: Partial<Transaction_Blockchain>) => api.post('/transaction_blockchain', data);
export const getTxByUser = (userId: string) => api.get(`/transaction_blockchain/user/${userId}`);
