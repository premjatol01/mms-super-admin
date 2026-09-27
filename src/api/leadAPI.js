import axiosClient from './axiosClient';

export const leadAPI = {
  getLeads: async (params) => {
    return await axiosClient.get('/leads', { params });
  },

  getLead: async (id) => {
    return await axiosClient.get(`/leads/${id}`);
  },

  createLead: async (data) => {
    return await axiosClient.post('/leads', data);
  },

  updateLead: async (id, data) => {
    return await axiosClient.put(`/leads/${id}`, data);
  },

  changeStage: async (id, stage) => {
    return await axiosClient.patch(`/leads/${id}/stage`, { stage });
  },

  toggleStatus: async (id) => {
    return await axiosClient.patch(`/leads/${id}/status`);
  },

  convertLead: async (id, restaurantId) => {
    return await axiosClient.patch(`/leads/${id}/convert`, { restaurantId });
  }
};
