import api from '@/lib/axios';
import { AI_Model } from '@/types/index';

export const createModel = (data: Partial<AI_Model>) => api.post('/models', data);
export const getModels = () => api.get<AI_Model[]>('/models');
export const getModelById = (id: string) => api.get<AI_Model>(`/models/${id}`);
export const updateModel = (id: string, data: Partial<AI_Model>) => api.put(`/models/${id}`, data);
export const deleteModel = (id: string) => api.delete(`/models/${id}`);

// Additional model-specific queries
export const getModelByUserId = (userId: string) => api.get<AI_Model[]>(`/models/user/${userId}`);
export const getModelsByCategoryId = (categoryId: string) => api.get<AI_Model[]>(`/models/category/${categoryId}`);
export const getModelsByStatus = (status: string) => api.get<AI_Model[]>(`/models/status/${status}`);
