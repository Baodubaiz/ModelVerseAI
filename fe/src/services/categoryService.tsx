import api from '@/lib/axios';
import { Category } from '@/types/index';

export const getCategories = () => api.get<Category[]>('/categories');
