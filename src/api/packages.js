import axiosClient from './axiosClient';

export const packagesAPI = {
  getPackages: async (params) => {
    return await axiosClient.get('/packages', { params });
  },
  getPackage: async (id) => {
    return await axiosClient.get(`/packages/${id}`);
  },
  toggleStatus: async (id) => {
    return await axiosClient.patch(`/packages/${id}/status`);
  },
};
