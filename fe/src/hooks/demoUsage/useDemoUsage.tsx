// hooks/useDemoUsage.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    createDemoUsage,
    getDemoUsageById,
    getDemoUsages,
    updateDemoUsage,
    deleteDemoUsage,
    getDemoUsageByUserId,
} from '@/services/demoUsageService';
import { Demo_Usage } from '@/types';

// Lấy tất cả demo usage
export const useDemoUsages = () => {
    return useQuery<Demo_Usage[]>({
        queryKey: ['demoUsages'],
        queryFn: async () => {
            const res = await getDemoUsages();
            return res.data;
        },
    });
};

// Lấy demo usage theo id
export const useDemoUsageById = (id: string) => {
    return useQuery<Demo_Usage>({
        queryKey: ['demoUsage', id],
        queryFn: async () => {
            const res = await getDemoUsageById(id);
            return res.data;
        },
        enabled: !!id,
    });
};

// Lấy demo usage theo userId
export const useDemoUsageByUserId = (userId: string) => {
    return useQuery<Demo_Usage[]>({
        queryKey: ['demoUsageByUser', userId],
        queryFn: async () => {
            const res = await getDemoUsageByUserId(userId);
            return res.data;
        },
        enabled: !!userId,
    });
};

// Tạo demo usage
export const useCreateDemoUsage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createDemoUsage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['demoUsages'] });
        },
    });
};

// Update demo usage
export const useUpdateDemoUsage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Demo_Usage> }) =>
            updateDemoUsage(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['demoUsage', id] });
            queryClient.invalidateQueries({ queryKey: ['demoUsages'] });
        },
    });
};

// Xoá demo usage
export const useDeleteDemoUsage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteDemoUsage(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['demoUsages'] });
        },
    });
};
