import { create } from "zustand";
import { initialPackages, durationOptions } from "../pages/packages/data/packageData";

export const usePackagesStore = create((set, get) => ({
  packages: initialPackages,
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
    total: initialPackages.length,
  },
  selectedPackage: null,
  editingPackage: null,
  showAddModal: false,
  showDetailsDrawer: false,
  showConfirmModal: false,
  confirmAction: null,

  // Filters
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

  // Modal controls
  openAddModal: () => set({ showAddModal: true, editingPackage: null }),
  closeAddModal: () => set({ showAddModal: false, editingPackage: null }),
  openEditModal: (pkg) => set({ showAddModal: true, editingPackage: pkg }),
  closeEditModal: () => set({ showAddModal: false, editingPackage: null }),
  
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

  // CRUD operations
  addPackage: (pkgData) => set((state) => {
    const newId = `PKG-${String(state.packages.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const durationInfo = durationOptions.find(d => d.value === pkgData.duration);
    
    return {
      packages: [{ 
        ...pkgData,
        id: newId,
        durationDisplay: durationInfo?.label || pkgData.duration,
        createdAt: today,
        updatedAt: today,
      }, ...state.packages],
      showAddModal: false,
    };
  }),

  updatePackage: (id, data) => set((state) => {
    const today = new Date().toISOString().split('T')[0];
    const durationInfo = durationOptions.find(d => d.value === data.duration);
    
    return {
      packages: state.packages.map(p => p.id === id ? { 
        ...p, 
        ...data,
        durationDisplay: durationInfo?.label || data.duration,
        updatedAt: today,
      } : p),
      selectedPackage: state.selectedPackage?.id === id ? { 
        ...state.selectedPackage, 
        ...data,
        durationDisplay: durationInfo?.label || data.duration,
        updatedAt: today,
      } : state.selectedPackage,
      showAddModal: false,
      editingPackage: null,
    };
  }),

  toggleStatus: (id) => set((state) => {
    const pkg = state.packages.find(p => p.id === id);
    const newStatus = pkg.status === "active" ? "inactive" : "active";
    const today = new Date().toISOString().split('T')[0];
    
    return {
      packages: state.packages.map(p => p.id === id ? { 
        ...p, 
        status: newStatus,
        updatedAt: today,
      } : p),
      selectedPackage: state.selectedPackage?.id === id ? { 
        ...state.selectedPackage, 
        status: newStatus,
        updatedAt: today,
      } : state.selectedPackage,
    };
  }),

  deletePackage: (id) => set((state) => ({
    packages: state.packages.filter(p => p.id !== id),
    selectedPackage: state.selectedPackage?.id === id ? null : state.selectedPackage,
  })),

  getFilteredPackages: () => {
    const { packages, filters } = get();
    
    return packages.filter(p => {
      const searchMatch = !filters.search || 
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.id.toLowerCase().includes(filters.search.toLowerCase());
      
      const statusMatch = !filters.status || p.status === filters.status;
      const durationMatch = !filters.duration || p.duration === filters.duration;
      
      return searchMatch && statusMatch && durationMatch;
    });
  },
}));