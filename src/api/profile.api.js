import axiosClient from './axiosClient';

export const profileAPI = {
  getProfile: async () => {
    return await axiosClient.get('/super-admin/profile');
  },
  updateProfile: async (data) => {
    return await axiosClient.put('/super-admin/profile', data);
  },
  changePassword: async (data) => {
    return await axiosClient.put('/super-admin/profile/change-password', data);
  },
};
