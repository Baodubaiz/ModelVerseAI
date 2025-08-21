import api from '@/lib/axios';
import { Demo_Usage } from '@/types/index';

export const createDemoUsage = (data: Partial<Demo_Usage>) => api.post('/demousage', data);
export const getDemoUsageById = (id: string) => api.get<Demo_Usage>(`/demousage/${id}`);
export const getDemoUsages = () => api.get<Demo_Usage[]>('/demousage');
export const updateDemoUsage = (id: string, data: Partial<Demo_Usage>) => api.put(`/demousage/${id}`, data);
export const deleteDemoUsage = (id: string) => api.delete(`/demousage/${id}`);

/// Additional demo usage-specific queries
export const getDemoUsageByUserId = (userId: string) => api.get<Demo_Usage[]>(`/demousage/user/${userId}`);
// export const getDemoUsageByModelId = (modelId: string) => api.get<Demo_Usage[]>(`/demousage/model/${modelId}`);
