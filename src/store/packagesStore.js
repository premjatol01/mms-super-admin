import { create } from "zustand";
import { packagesAPI } from "../api/packages";

export const usePackagesStore = create((set, get) => ({
  packages: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    status: "",
    duration: "",
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  selectedPackage: null,
  showDetailsDrawer: false,
  showConfirmModal: false,
  confirmAction: null,

  // Fetch Packages from DB
  fetchPackages: async () => {
    set({ loading: true, error: null });
    try {
      const res = await packagesAPI.getPackages();
      const list = res.data?.data || res.data || [];
      const formatted = list.map(p => ({
        ...p,
        id: p._id || p.id,
      }));
      set({ 
        packages: formatted, 
        loading: false,
        pagination: { ...get().pagination, total: formatted.length }
      });
    } catch (err) {
      set({ loading: false, error: err.message || "Failed to load packages" });
    }
  },

  // Filters
  setFilters: (newFilters) => set((state) => ({ 
    filters: { ...state.filters, ...newFilters },
    pagination: { ...state.pagination, page: 1 }
  })),

  setFilter: (key, value) => set((state) => ({ 
    filters: { ...state.filters, [key]: value },
    pagination: { ...state.pagination, page: 1 }
  })),
  resetFilters: () => set({ 
    filters: { search: "", status: "", duration: "" },
    pagination: { ...get().pagination, page: 1 }
  }),
  
  // Pagination
  setPage: (page) => set((state) => ({ pagination: { ...state.pagination, page } })),
  setLimit: (limit) => set((state) => ({ pagination: { ...state.pagination, limit, page: 1 } })),

  // Drawer & Modal controls
  openDetails: (pkg) => set({ selectedPackage: pkg, showDetailsDrawer: true }),
  closeDetails: () => set({ selectedPackage: null, showDetailsDrawer: false }),

  showConfirm: (action, pkg) => set({ 
    showConfirmModal: true, 
    confirmAction: action, 
    selectedPackage: pkg 
  }),
  hideConfirm: () => set({ 
    showConfirmModal: false, 
    confirmAction: null, 
    selectedPackage: null 
  }),

  // Status toggle in DB
  toggleStatus: async (id) => {
    try {
      const res = await packagesAPI.toggleStatus(id);
      const updated = res.data?.data;
      if (updated) {
        set((state) => ({
          packages: state.packages.map((p) =>
            (p._id === id || p.id === id)
              ? { ...p, status: updated.status }
              : p
          ),
          selectedPackage:
            state.selectedPackage && (state.selectedPackage._id === id || state.selectedPackage.id === id)
              ? { ...state.selectedPackage, status: updated.status }
              : state.selectedPackage,
        }));
      }
    } catch (err) {
      console.error("Failed to toggle package status:", err);
    }
  },

  getFilteredPackages: () => {
    const { packages, filters } = get();
    
    return packages.filter(p => {
      const name = p.name || "";
      const id = p.id || p._id || "";
      const searchMatch = !filters.search || 
        name.toLowerCase().includes(filters.search.toLowerCase()) ||
        id.toLowerCase().includes(filters.search.toLowerCase());
      
            const statusMatch = !filters.status || p.status === filters.status;
      const durationMatch = !filters.duration || 
        p.duration === filters.duration || 
        p.pricing?.some(tier => tier.duration === filters.duration || String(tier.durationDays) === filters.duration);
      
      return searchMatch && statusMatch && durationMatch;
    });
  },
}));
