import axiosClient from './axiosClient';

export const authAPI = {
  login: async (credentials) => {
    return await axiosClient.post('/auth/login', credentials);
  },
  logout: async () => {
    return await axiosClient.post('/auth/logout');
  }
};
