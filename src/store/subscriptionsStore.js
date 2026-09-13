import { create } from "zustand";
import { initialSubscriptions } from "../pages/subscriptions/data/subscriptionData";
import { getPackageByName } from "../pages/subscriptions/data/packageHelper";

export const useSubscriptionsStore = create((set, get) => ({
  subscriptions: initialSubscriptions,
  loading: false,
  error: null,
  filters: {
    search: "",
    status: "",
    package: "",
    duration: "",
  },
  pagination: {
    page: 1,
    limit: 10,
    total: initialSubscriptions.length,
  },
  selectedSubscription: null,
  editingSubscription: null,
  showAssignModal: false,
  showDetailsDrawer: false,
  showConfirmModal: false,
  confirmAction: null,
  showRenewModal: false,
  showChangePackageModal: false,

  // Filters
  setFilter: (key, value) => set((state) => ({ 
    filters: { ...state.filters, [key]: value },
    pagination: { ...state.pagination, page: 1 }
  })),
  resetFilters: () => set({ 
    filters: { search: "", status: "", package: "", duration: "" },
    pagination: { ...get().pagination, page: 1 }
  }),
  
  // Pagination
  setPage: (page) => set((state) => ({ pagination: { ...state.pagination, page } })),
  setLimit: (limit) => set((state) => ({ pagination: { ...state.pagination, limit, page: 1 } })),

  // Modal controls
  openAssignModal: () => set({ showAssignModal: true, editingSubscription: null }),
  closeAssignModal: () => set({ showAssignModal: false, editingSubscription: null }),
  
  openDetails: (sub) => set({ selectedSubscription: sub, showDetailsDrawer: true }),
  closeDetails: () => set({ selectedSubscription: null, showDetailsDrawer: false }),

  showConfirm: (action, sub) => set({ 
    showConfirmModal: true, 
    confirmAction: action, 
    selectedSubscription: sub 
  }),
  hideConfirm: () => set({ 
    showConfirmModal: false, 
    confirmAction: null, 
    selectedSubscription: null 
  }),

  // Renew & Change Package modals
  openRenewModal: (sub) => set({ showRenewModal: true, selectedSubscription: sub }),
  closeRenewModal: () => set({ showRenewModal: false }),
  openChangePackageModal: (sub) => set({ showChangePackageModal: true, selectedSubscription: sub }),
  closeChangePackageModal: () => set({ showChangePackageModal: false }),

  // CRUD operations
  assignSubscription: (subData) => set((state) => {
    const newId = `SUB-${String(state.subscriptions.length + 1).padStart(3, '0')}`;
    const pkg = getPackageByName(subData.packageName);
    const today = new Date().toISOString().split('T')[0];
    const endDate = new Date(subData.startDate);
    endDate.setDate(endDate.getDate() + subData.duration);
    
    return {
      subscriptions: [{ 
        ...subData,
        id: newId,
        packageId: pkg?.id || "",
        durationDisplay: `${subData.duration} Days`,
        endDate: endDate.toISOString().split('T')[0],
        status: "active",
        features: pkg?.features || [],
        createdAt: today,
        updatedAt: today,
      }, ...state.subscriptions],
      showAssignModal: false,
    };
  }),

  renewSubscription: (id, duration) => set((state) => {
    const sub = state.subscriptions.find(s => s.id === id);
    if (!sub) return state;
    
    const today = new Date().toISOString().split('T')[0];
    const currentEndDate = new Date(sub.endDate);
    const newEndDate = new Date(currentEndDate);
    newEndDate.setDate(newEndDate.getDate() + duration);
    
    return {
      subscriptions: state.subscriptions.map(s => s.id === id ? {
        ...s,
        duration: s.duration + duration,
        durationDisplay: `${s.duration + duration} Days`,
        endDate: newEndDate.toISOString().split('T')[0],
        status: "active",
        updatedAt: today,
      } : s),
      selectedSubscription: state.selectedSubscription?.id === id ? {
        ...state.selectedSubscription,
        duration: state.selectedSubscription.duration + duration,
        durationDisplay: `${state.selectedSubscription.duration + duration} Days`,
        endDate: newEndDate.toISOString().split('T')[0],
        status: "active",
        updatedAt: today,
      } : state.selectedSubscription,
    };
  }),

  changePackage: (id, newPackageName) => set((state) => {
    const pkg = getPackageByName(newPackageName);
    const today = new Date().toISOString().split('T')[0];
    
    return {
      subscriptions: state.subscriptions.map(s => s.id === id ? {
        ...s,
        packageName: newPackageName,
        packageId: pkg?.id || "",
        features: pkg?.features || [],
        updatedAt: today,
      } : s),
      selectedSubscription: state.selectedSubscription?.id === id ? {
        ...state.selectedSubscription,
        packageName: newPackageName,
        packageId: pkg?.id || "",
        features: pkg?.features || [],
        updatedAt: today,
      } : state.selectedSubscription,
    };
  }),

  cancelSubscription: (id) => set((state) => {
    const today = new Date().toISOString().split('T')[0];
    return {
      subscriptions: state.subscriptions.map(s => s.id === id ? {
        ...s,
        status: "cancelled",
        updatedAt: today,
      } : s),
      selectedSubscription: state.selectedSubscription?.id === id ? {
        ...state.selectedSubscription,
        status: "cancelled",
        updatedAt: today,
      } : state.selectedSubscription,
    };
  }),

  reactivateSubscription: (id) => set((state) => {
    const today = new Date().toISOString().split('T')[0];
    return {
      subscriptions: state.subscriptions.map(s => s.id === id ? {
        ...s,
        status: "active",
        updatedAt: today,
      } : s),
      selectedSubscription: state.selectedSubscription?.id === id ? {
        ...state.selectedSubscription,
        status: "active",
        updatedAt: today,
      } : state.selectedSubscription,
    };
  }),

  getFilteredSubscriptions: () => {
    const { subscriptions, filters } = get();
    
    return subscriptions.filter(sub => {
      const searchMatch = !filters.search || 
        sub.restaurantName.toLowerCase().includes(filters.search.toLowerCase()) ||
        sub.adminName.toLowerCase().includes(filters.search.toLowerCase()) ||
        sub.adminEmail.toLowerCase().includes(filters.search.toLowerCase()) ||
        sub.packageName.toLowerCase().includes(filters.search.toLowerCase()) ||
        sub.id.toLowerCase().includes(filters.search.toLowerCase());
      
      const statusMatch = !filters.status || sub.status === filters.status;
      const packageMatch = !filters.package || sub.packageName === filters.package;
      const durationMatch = !filters.duration || sub.duration === parseInt(filters.duration);
      
      return searchMatch && statusMatch && packageMatch && durationMatch;
    });
  },

  getSummary: () => {
    const subscriptions = get().subscriptions;
    const now = new Date();
    
    // Calculate expiring (within 7 days)
    const expiringSubscriptions = subscriptions.filter(sub => {
      if (sub.status !== "active") return false;
      const endDate = new Date(sub.endDate);
      const diff = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      return diff > 0 && diff <= 7;
    });

    return {
      total: subscriptions.length,
      active: subscriptions.filter(s => s.status === "active").length,
      expiring: expiringSubscriptions.length,
      expired: subscriptions.filter(s => s.status === "expired" || s.status === "cancelled").length,
    };
  },
}));