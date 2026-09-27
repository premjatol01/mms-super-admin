import axiosClient from './axiosClient';

export const qrTemplateAPI = {
  getTemplates: async () => {
    return await axiosClient.get('/qr-templates');
  },
  getTemplate: async (id) => {
    return await axiosClient.get(`/qr-templates/${id}`);
  },
  uploadTemplate: async (formData) => {
    return await axiosClient.post('/qr-templates', formData);
  },
  updateTemplate: async (id, data) => {
    return await axiosClient.put(`/qr-templates/${id}`, data);
  },
  deleteTemplate: async (id) => {
    return await axiosClient.delete(`/qr-templates/${id}`);
  }
};
