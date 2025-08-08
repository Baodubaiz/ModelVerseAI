import api from '@/lib/axios';

export const confirmOrder = (data: { transactionId: string, imageUrl: string }) =>
    api.post('/order-confirmation', data);
