// hooks/useReview.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    addReview,
    getReviews,
    getReviewById,
    updateReview,
    deleteReview,
    getReviewsByModelId,
} from '@/services/reviewService';
import { Review } from '@/types/index';

// Lấy tất cả reviews
export const useReviews = () => {
    return useQuery<Review[]>({
        queryKey: ['reviews'],
        queryFn: async () => {
            const res = await getReviews();
            return res.data;
        },
    });
};

// Lấy review theo ID
export const useReviewById = (id: string) => {
    return useQuery<Review>({
        queryKey: ['review', id],
        queryFn: async () => {
            const res = await getReviewById(id);
            return res.data;
        },
        enabled: !!id,
    });
};

// Lấy reviews theo modelId
export const useReviewsByModelId = (modelId: string) => {
    return useQuery<Review[]>({
        queryKey: ['reviews', 'model', modelId],
        queryFn: async () => {
            const res = await getReviewsByModelId(modelId);
            return res.data;
        },
        enabled: !!modelId,
    });
};

// Thêm review
export const useAddReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
        },
    });
};

// Update review
export const useUpdateReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Review> }) =>
            updateReview(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['review', id] });
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
        },
    });
};

// Delete review
export const useDeleteReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
        },
    });
};
