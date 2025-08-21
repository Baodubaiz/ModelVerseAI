// hooks/useTransactionVND.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    createVNDTx,
    getVNDTx,
    getVNDTxById,
    updateVNDTx,
    deleteVNDTx,
    getVNDTxByUserId,
} from '@/services/transactionVNDService';
import { Transaction_VND } from '@/types/index';

// Lấy tất cả giao dịch VND
export const useVNDTxs = () => {
    return useQuery<Transaction_VND[]>({
        queryKey: ['transactions_vnd'],
        queryFn: async () => {
            const res = await getVNDTx();
            return res.data;
        },
    });
};

// Lấy giao dịch VND theo ID
export const useVNDTxById = (id: string) => {
    return useQuery<Transaction_VND>({
        queryKey: ['transaction_vnd', id],
        queryFn: async () => {
            const res = await getVNDTxById(id);
            return res.data;
        },
        enabled: !!id,
    });
};

// Lấy giao dịch VND theo userId
export const useVNDTxByUserId = (userId: string) => {
    return useQuery<Transaction_VND[]>({
        queryKey: ['transactions_vnd', 'user', userId],
        queryFn: async () => {
            const res = await getVNDTxByUserId(userId);
            return res.data;
        },
        enabled: !!userId,
    });
};

// Tạo giao dịch VND
export const useCreateVNDTx = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createVNDTx,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions_vnd'] });
        },
    });
};

// Update giao dịch VND
export const useUpdateVNDTx = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Transaction_VND> }) =>
            updateVNDTx(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['transaction_vnd', id] });
            queryClient.invalidateQueries({ queryKey: ['transactions_vnd'] });
        },
    });
};

// Delete giao dịch VND
export const useDeleteVNDTx = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteVNDTx,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions_vnd'] });
        },
    });
};
