// hooks/useTransactionBlockchain.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    createBlockchainTx,
    getBlockchainsTx,
    getBlockchainByIdTx,
    updateBlockchainTx,
    deleteBlockchainTx,
    getBlockchainsTxByUserId,
} from '@/services/transactionBlockchainService';
import { Transaction_Blockchain } from '@/types/index';

// Lấy tất cả giao dịch blockchain
export const useBlockchainTxs = () => {
    return useQuery<Transaction_Blockchain[]>({
        queryKey: ['transactions_blockchain'],
        queryFn: async () => {
            const res = await getBlockchainsTx();
            return res.data;
        },
    });
};

// Lấy giao dịch blockchain theo ID
export const useBlockchainTxById = (id: string) => {
    return useQuery<Transaction_Blockchain>({
        queryKey: ['transaction_blockchain', id],
        queryFn: async () => {
            const res = await getBlockchainByIdTx(id);
            return res.data;
        },
        enabled: !!id,
    });
};

// Lấy giao dịch blockchain theo userId
export const useBlockchainTxByUserId = (userId: string) => {
    return useQuery<Transaction_Blockchain[]>({
        queryKey: ['transactions_blockchain', 'user', userId],
        queryFn: async () => {
            const res = await getBlockchainsTxByUserId(userId);
            return res.data;
        },
        enabled: !!userId,
    });
};

// Tạo giao dịch blockchain
export const useCreateBlockchainTx = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBlockchainTx,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions_blockchain'] });
        },
    });
};

// Update giao dịch blockchain
export const useUpdateBlockchainTx = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Transaction_Blockchain> }) =>
            updateBlockchainTx(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['transaction_blockchain', id] });
            queryClient.invalidateQueries({ queryKey: ['transactions_blockchain'] });
        },
    });
};

// Delete giao dịch blockchain
export const useDeleteBlockchainTx = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBlockchainTx,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions_blockchain'] });
        },
    });
};
