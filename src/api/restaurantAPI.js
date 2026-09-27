import axiosClient from './axiosClient';

export const restaurantAPI = {
  getRestaurants: async (params) => {
    return await axiosClient.get('/restaurants', { params });
  },
  
  getRestaurant: async (id) => {
    return await axiosClient.get(`/restaurants/${id}`);
  },
  
  createRestaurant: async (data) => {
    return await axiosClient.post('/restaurants', data);
  },
  
  updateRestaurant: async (id, data) => {
    return await axiosClient.put(`/restaurants/${id}`, data);
  },
  
  toggleStatus: async (id) => {
    return await axiosClient.patch(`/restaurants/${id}/status`);
  },
  
  bulkUpdateStatus: async (ids, status) => {
    return await axiosClient.patch('/restaurants/bulk/status', { ids, status });
  }
};
