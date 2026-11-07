import axiosClient from './axiosClient';

export const cmsAPI = {
  getCmsData: async () => {
    return await axiosClient.get('/cms');
  },
  updateConfig: async (data) => {
    return await axiosClient.put('/cms/config', data);
  },
  publishWebsite: async () => {
    return await axiosClient.post('/cms/publish');
  },
  unpublishWebsite: async () => {
    return await axiosClient.post('/cms/unpublish');
  },
  updateSection: async (sectionId, data) => {
    return await axiosClient.put(`/cms/sections/${sectionId}`, data);
  },
  toggleSection: async (sectionId) => {
    return await axiosClient.patch(`/cms/sections/${sectionId}/toggle`);
  },
};
