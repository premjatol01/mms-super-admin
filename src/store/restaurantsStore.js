import { create } from "zustand";
import { initialRestaurants, subscriptionPackages } from "../pages/restaurants/data/restaurantData";

export const useRestaurantsStore = create((set, get) => ({
  restaurants: initialRestaurants,
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
    total: initialRestaurants.length,
  },
  selectedRestaurants: [],
  showAddModal: false,
  showDetailsDrawer: false,
  showConfirmModal: false,
  confirmAction: null,
  selectedRestaurant: null,
  editingRestaurant: null,

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
    const filtered = get().getFilteredRestaurants();
    if (filtered.length === 0) return state;
    const allSelected = state.selectedRestaurants.length === filtered.length;
    return { selectedRestaurants: allSelected ? [] : filtered.map(r => r.id) };
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

  // CRUD
  addRestaurant: (restaurant) => set((state) => ({
    restaurants: [{ 
      ...restaurant, 
      id: String(state.restaurants.length + 1), 
      createdAt: new Date().toISOString().split('T')[0] 
    }, ...state.restaurants],
    showAddModal: false,
  })),

  updateRestaurant: (id, data) => set((state) => ({
    restaurants: state.restaurants.map(r => r.id === id ? { ...r, ...data } : r),
    selectedRestaurant: state.selectedRestaurant?.id === id ? { ...state.selectedRestaurant, ...data } : state.selectedRestaurant,
    showAddModal: false,
    editingRestaurant: null,
  })),

  toggleStatus: (id) => set((state) => ({
    restaurants: state.restaurants.map(r => r.id === id ? { 
      ...r, 
      status: r.status === "active" ? "inactive" : "active" 
    } : r),
    selectedRestaurant: state.selectedRestaurant?.id === id ? { 
      ...state.selectedRestaurant, 
      status: state.selectedRestaurant.status === "active" ? "inactive" : "active" 
    } : state.selectedRestaurant,
  })),

  getFilteredRestaurants: () => {
    const { restaurants, filters } = get();
    return restaurants.filter(r => {
      const searchMatch = !filters.search || 
        r.name.toLowerCase().includes(filters.search.toLowerCase()) || 
        r.admin.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        r.admin.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        r.admin.phone.includes(filters.search);
      
      const statusMatch = !filters.status || r.status === filters.status;
      const subStatusMatch = !filters.subscriptionStatus || r.subscription.status === filters.subscriptionStatus;
      const packageMatch = !filters.package || r.subscription.package.toLowerCase() === filters.package.toLowerCase();
      const cityMatch = !filters.city || r.address.city.toLowerCase() === filters.city.toLowerCase();
      const dateFromMatch = !filters.dateFrom || r.createdAt >= filters.dateFrom;
      const dateToMatch = !filters.dateTo || r.createdAt <= filters.dateTo;
      
      return searchMatch && statusMatch && subStatusMatch && packageMatch && cityMatch && dateFromMatch && dateToMatch;
    });
  },
}));

export { subscriptionPackages };