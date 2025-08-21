// hooks/useOrderConfirmation.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    confirmOrder,
    getOrderConfirmations,
    getOrderConfirmationById,
    updateOrderConfirmation,
} from '@/services/orderConfirmationService';

export interface OrderConfirmation {
    id: string;
    transactionId: string;
    imageUrl: string;
    created_at: string;
    updated_at: string;
}

// Lấy tất cả order confirmations
export const useOrderConfirmations = () => {
    return useQuery<OrderConfirmation[]>({
        queryKey: ['orderConfirmations'],
        queryFn: async () => {
            const res = await getOrderConfirmations();
            return res.data;
        },
    });
};

// Lấy order confirmation theo id
export const useOrderConfirmationById = (id: string) => {
    return useQuery<OrderConfirmation>({
        queryKey: ['orderConfirmation', id],
        queryFn: async () => {
            const res = await getOrderConfirmationById(id);
            return res.data;
        },
        enabled: !!id,
    });
};

// Xác nhận đơn hàng (tạo mới)
export const useConfirmOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: confirmOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orderConfirmations'] });
        },
    });
};

// Update order confirmation
export const useUpdateOrderConfirmation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { transactionId?: string; imageUrl?: string } }) =>
            updateOrderConfirmation(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['orderConfirmation', id] });
            queryClient.invalidateQueries({ queryKey: ['orderConfirmations'] });
        },
    });
};
