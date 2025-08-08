import api from '@/lib/axios';
import { AI_Model } from '@/types/index';

export const getModels = () => api.get<AI_Model[]>('/aimodels');
export const getModelById = (id: string) => api.get<AI_Model>(`/aimodels/${id}`);
export const createModel = (data: Partial<AI_Model>) => api.post('/aimodels', data);
export const updateModel = (id: string, data: Partial<AI_Model>) => api.put(`/aimodels/${id}`, data);
export const deleteModel = (id: string) => api.delete(`/aimodels/${id}`);
