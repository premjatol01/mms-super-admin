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
};
