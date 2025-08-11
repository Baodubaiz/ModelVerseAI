import api from '@/lib/axios';
import { Review } from '@/types/index';

export const addReview = (data: Partial<Review>) => api.post('/reviews', data);
export const getReviews = () => api.get<Review[]>('/reviews');
export const getReviewById = (id: string) => api.get<Review>(`/reviews/${id}`);
export const updateReview = (id: string, data: Partial<Review>) => api.put(`/reviews/${id}`, data);
export const deleteReview = (id: string) => api.delete(`/reviews/${id}`);

// Lấy tất cả đánh giá theo model ID
export const getReviewsByModelId = (modelId: string) => api.get<Review[]>(`/reviews/model/${modelId}`);
