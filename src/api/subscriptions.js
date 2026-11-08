import axiosClient from './axiosClient';

export const subscriptionsAPI = {
  getSubscriptions: async (params) => {
    return await axiosClient.get('/subscriptions', { params });
  },
  getSummary: async () => {
    return await axiosClient.get('/subscriptions/summary');
  },
  getSubscription: async (id) => {
    return await axiosClient.get(`/subscriptions/${id}`);
  },
  assignSubscription: async (data) => {
    return await axiosClient.post('/subscriptions', data);
  },
  renewSubscription: async (id, data) => {
    return await axiosClient.post(`/subscriptions/${id}/renew`, data);
  },
  changePackage: async (id, data) => {
    return await axiosClient.patch(`/subscriptions/${id}/package`, data);
  },
  cancelSubscription: async (id) => {
    return await axiosClient.patch(`/subscriptions/${id}/cancel`);
  },
  reactivateSubscription: async (id) => {
    return await axiosClient.patch(`/subscriptions/${id}/reactivate`);
  },

  // Payment Verification Requests
  getPaymentRequests: async (params) => {
    return await axiosClient.get('/subscriptions/payment-requests', { params });
  },
  reviewPaymentRequest: async (id, data) => {
    return await axiosClient.patch(`/subscriptions/payment-requests/${id}`, data);
  },

  // Subscription Support Tickets
  getTickets: async (params) => {
    return await axiosClient.get('/subscriptions/tickets', { params });
  },
  updateTicket: async (id, data) => {
    return await axiosClient.patch(`/subscriptions/tickets/${id}`, data);
  },

  // Payment QR & UPI Settings
  getPaymentConfig: async () => {
    return await axiosClient.get('/subscriptions/payment-config');
  },
  updatePaymentConfig: async (data) => {
    return await axiosClient.put('/subscriptions/payment-config', data);
  },
};
