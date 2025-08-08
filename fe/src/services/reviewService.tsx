import api from '@/lib/axios';
import { Review } from '@/types/index';

export const getReviewsByModel = (modelId: string) => api.get<Review[]>(`/reviews/model/${modelId}`);
export const addReview = (data: Partial<Review>) => api.post('/reviews', data);
export const deleteReview = (id: string) => api.delete(`/reviews/${id}`);
