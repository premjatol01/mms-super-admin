import { create } from "zustand";
import { leadAPI } from "../api/leadAPI";

export const useLeadsStore = create((set, get) => ({
  leads: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    stage: "",
    status: "",
    city: "",
    dateRange: "",
    converted: ""
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  },
  selectedLeads: [],
  showAddModal: false,
  showDetailsDrawer: false,
  showConfirmModal: false,
  showConvertModal: false,
  confirmAction: null,
  selectedLead: null,
  editingLead: null,
  convertStep: 1,
  convertData: {},

  // Data Fetching
  fetchLeads: async () => {
    try {
      set({ loading: true, error: null });
      const { filters, pagination } = get();
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      // Clean up empty filters
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const data = await leadAPI.getLeads(params);
      
      // Remap _id to id for frontend components
      const mappedLeads = data.leads.map(l => ({ ...l, id: l._id }));

      set({ 
        leads: mappedLeads,
        pagination: {
          ...get().pagination,
          total: data.pagination.total
        },
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Filters
  setFilter: (key, value) => {
    set((state) => ({ 
      filters: { ...state.filters, [key]: value },
      pagination: { ...state.pagination, page: 1 }
    }));
    get().fetchLeads();
  },
  
  resetFilters: () => {
    set({ 
      filters: { search: "", stage: "", status: "", city: "", dateRange: "", converted: "" },
      pagination: { ...get().pagination, page: 1 }
    });
    get().fetchLeads();
  },
  
  // Pagination
  setPage: (page) => {
    set((state) => ({ pagination: { ...state.pagination, page } }));
    get().fetchLeads();
  },
  
  setLimit: (limit) => {
    set((state) => ({ pagination: { ...state.pagination, limit, page: 1 } }));
    get().fetchLeads();
  },

  // Modals
  openAddModal: () => set({ showAddModal: true, editingLead: null }),
  closeAddModal: () => set({ showAddModal: false, editingLead: null }),
  openEditModal: (lead) => set({ showAddModal: true, editingLead: lead }),
  closeEditModal: () => set({ showAddModal: false, editingLead: null }),
  
  openDetails: (lead) => set({ selectedLead: lead, showDetailsDrawer: true }),
  closeDetails: () => set({ selectedLead: null, showDetailsDrawer: false }),

  showConfirm: (action, lead) => set({ 
    showConfirmModal: true, 
    confirmAction: action, 
    selectedLead: lead 
  }),
  hideConfirm: () => set({ 
    showConfirmModal: false, 
    confirmAction: null, 
    selectedLead: null 
  }),

  // Convert flow
  openConvertModal: (lead) => set({ 
    showConvertModal: true, 
    selectedLead: lead,
    convertStep: 1,
    convertData: {
      restaurantName: lead.restaurantName || "",
      address: lead.address?.fullAddress || "",
      city: lead.address?.city || "",
      state: lead.address?.state || "",
      pincode: lead.address?.pincode || "",
      adminName: lead.contactPerson || "",
      adminPhone: lead.phone || "",
      adminEmail: lead.email || "",
      package: "",
      subscriptionDuration: "30",
      status: "active"
    }
  }),
  closeConvertModal: () => set({ 
    showConvertModal: false, 
    selectedLead: null,
    convertStep: 1,
    convertData: {}
  }),
  setConvertStep: (step) => set({ convertStep: step }),
  updateConvertData: (data) => set((state) => ({ 
    convertData: { ...state.convertData, ...data } 
  })),

  // CRUD API Calls
  addLead: async (leadData) => {
    try {
      set({ loading: true, error: null });
      await leadAPI.createLead(leadData);
      set({ showAddModal: false, loading: false });
      get().fetchLeads();
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateLead: async (id, data) => {
    try {
      set({ loading: true, error: null });
      await leadAPI.updateLead(id, data);
      
      // Update selected lead if it's the one being edited
      if (get().selectedLead?.id === id) {
        const updated = await leadAPI.getLead(id);
        set({ selectedLead: { ...updated, id: updated._id } });
      }
      
      set({ showAddModal: false, editingLead: null, loading: false });
      get().fetchLeads();
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  toggleStatus: async (id) => {
    try {
      set({ loading: true, error: null });
      await leadAPI.toggleStatus(id);
      
      if (get().selectedLead?.id === id) {
        const updated = await leadAPI.getLead(id);
        set({ selectedLead: { ...updated, id: updated._id } });
      }
      
      set({ loading: false });
      get().fetchLeads();
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  changeStage: async (id, newStage) => {
    try {
      set({ loading: true, error: null });
      await leadAPI.changeStage(id, newStage);
      
      if (get().selectedLead?.id === id) {
        const updated = await leadAPI.getLead(id);
        set({ selectedLead: { ...updated, id: updated._id } });
      }
      
      set({ loading: false });
      get().fetchLeads();
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  convertLead: async (restaurantId) => {
    try {
      set({ loading: true, error: null });
      const leadId = get().selectedLead?.id;
      if (leadId) {
        await leadAPI.convertLead(leadId, restaurantId);
      }
      set({ showConvertModal: false, loading: false });
      get().fetchLeads();
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // To support Kanban which gets all filtered leads without pagination
  getFilteredLeads: () => {
    return get().leads;
  }
}));