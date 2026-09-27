import { create } from "zustand";
import { restaurantAPI } from "../api/restaurantAPI";
import { subscriptionPackages } from "../pages/restaurants/data/restaurantData";

export const useRestaurantsStore = create((set, get) => ({
  restaurants: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    status: "",
    subscriptionStatus: "",
    package: "",
    city: "",
    dateFrom: "",
    dateTo: "",
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  selectedRestaurants: [],
  showAddModal: false,
  showDetailsDrawer: false,
  showConfirmModal: false,
  confirmAction: null,
  selectedRestaurant: null,
  editingRestaurant: null,

  // Fetch
  fetchRestaurants: async () => {
    const state = get();
    set({ loading: true, error: null });
    try {
      const params = {
        ...state.filters,
        page: state.pagination.page,
        limit: state.pagination.limit,
      };
      
      // Clean up empty params
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const res = await restaurantAPI.getRestaurants(params);
      
      set({ 
        restaurants: res.data,
        pagination: {
          ...state.pagination,
          total: res.pagination.total,
          page: res.pagination.page,
          limit: res.pagination.limit,
        },
        loading: false 
      });
    } catch (error) {
      set({ error: error.message || "Failed to fetch restaurants", loading: false });
    }
  },

  // Filters
  setFilter: (key, value) => set((state) => ({ 
    filters: { ...state.filters, [key]: value },
    pagination: { ...state.pagination, page: 1 }
  })),
  resetFilters: () => set({ 
    filters: { search: "", status: "", subscriptionStatus: "", package: "", city: "", dateFrom: "", dateTo: "" },
    pagination: { ...get().pagination, page: 1 }
  }),
  
  // Pagination
  setPage: (page) => set((state) => ({ pagination: { ...state.pagination, page } })),
  setLimit: (limit) => set((state) => ({ pagination: { ...state.pagination, limit, page: 1 } })),

  // Selection
  toggleSelectAll: () => set((state) => {
    if (state.restaurants.length === 0) return state;
    const allSelected = state.selectedRestaurants.length === state.restaurants.length;
    return { selectedRestaurants: allSelected ? [] : state.restaurants.map(r => r._id) };
  }),
  toggleSelect: (id) => set((state) => ({
    selectedRestaurants: state.selectedRestaurants.includes(id)
      ? state.selectedRestaurants.filter(rid => rid !== id)
      : [...state.selectedRestaurants, id]
  })),
  clearSelection: () => set({ selectedRestaurants: [] }),

  // Modals
  openAddModal: () => set({ showAddModal: true, editingRestaurant: null }),
  closeAddModal: () => set({ showAddModal: false, editingRestaurant: null }),
  openEditModal: (restaurant) => set({ showAddModal: true, editingRestaurant: restaurant }),
  closeEditModal: () => set({ showAddModal: false, editingRestaurant: null }),
  
  openDetails: (restaurant) => set({ selectedRestaurant: restaurant, showDetailsDrawer: true }),
  closeDetails: () => set({ selectedRestaurant: null, showDetailsDrawer: false }),

  showConfirm: (action, restaurant) => set({ 
    showConfirmModal: true, 
    confirmAction: action, 
    selectedRestaurant: restaurant 
  }),
  hideConfirm: () => set({ 
    showConfirmModal: false, 
    confirmAction: null, 
    selectedRestaurant: null 
  }),

  // CRUD Actions
  addRestaurant: async (formData) => {
    set({ loading: true });
    try {
      const response = await restaurantAPI.createRestaurant(formData);
      set({ showAddModal: false });
      await get().fetchRestaurants();
      return response.data;
    } catch (error) {
      set({ error: error.message || "Failed to add restaurant" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateRestaurant: async (id, formData) => {
    set({ loading: true });
    try {
      await restaurantAPI.updateRestaurant(id, formData);
      set({ showAddModal: false, editingRestaurant: null });
      await get().fetchRestaurants();
      
      // Update selected if open
      const { selectedRestaurant } = get();
      if (selectedRestaurant && selectedRestaurant._id === id) {
        const res = await restaurantAPI.getRestaurant(id);
        set({ selectedRestaurant: res.data });
      }
    } catch (error) {
      set({ error: error.message || "Failed to update restaurant" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  toggleStatus: async (id) => {
    set({ loading: true });
    try {
      await restaurantAPI.toggleStatus(id);
      await get().fetchRestaurants();
      
      const { selectedRestaurant } = get();
      if (selectedRestaurant && selectedRestaurant._id === id) {
        const res = await restaurantAPI.getRestaurant(id);
        set({ selectedRestaurant: res.data });
      }
    } catch (error) {
      set({ error: error.message || "Failed to toggle status" });
      throw error;
    } finally {
      set({ loading: false });
      set({ showConfirmModal: false, confirmAction: null, selectedRestaurant: null });
    }
  },
  
  bulkUpdateStatus: async (ids, status) => {
    set({ loading: true });
    try {
      await restaurantAPI.bulkUpdateStatus(ids, status);
      await get().fetchRestaurants();
      set({ selectedRestaurants: [] });
    } catch (error) {
      set({ error: error.message || "Failed to update restaurants" });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));

export { subscriptionPackages };