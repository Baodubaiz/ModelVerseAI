import api from '@/lib/axios';
import { Demo_Usage } from '@/types/index';

export const createDemoUsage = (data: Partial<Demo_Usage>) => api.post('/demousage', data);
export const getDemoUsageByUser = (userId: string) => api.get<Demo_Usage[]>(`/demousage/user/${userId}`);
