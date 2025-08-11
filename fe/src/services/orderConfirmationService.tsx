import api from '@/lib/axios';

export const confirmOrder = (data: { transactionId: string, imageUrl: string }) => api.post('/order-confirmation', data);
export const getOrderConfirmations = () => api.get('/order-confirmation');
export const updateOrderConfirmation = (id: string, data: { transactionId?: string, imageUrl?: string }) => api.put(`/order-confirmation/${id}`, data);

// Lấy thông tin xác nhận đơn hàng theo ID
export const getOrderConfirmationById = (id: string) => api.get(`/order-confirmation/${id}`);