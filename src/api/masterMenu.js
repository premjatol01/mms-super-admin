import axiosClient from './axiosClient';

export const masterMenuAPI = {
  // Categories
  getCategories: async () => {
    return await axiosClient.get('/master-menu/categories');
  },
  createCategory: async (data) => {
    return await axiosClient.post('/master-menu/categories', data);
  },
  updateCategory: async (id, data) => {
    return await axiosClient.put(`/master-menu/categories/${id}`, data);
  },
  deleteCategory: async (id) => {
    return await axiosClient.delete(`/master-menu/categories/${id}`);
  },

  // Items
  getItems: async () => {
    return await axiosClient.get('/master-menu/items');
  },
  createItem: async (data) => {
    return await axiosClient.post('/master-menu/items', data);
  },
  updateItem: async (id, data) => {
    return await axiosClient.put(`/master-menu/items/${id}`, data);
  },
  deleteItem: async (id) => {
    return await axiosClient.delete(`/master-menu/items/${id}`);
  },
};
