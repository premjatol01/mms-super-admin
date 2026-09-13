import { create } from "zustand";
import { initialLeads, leadStages } from "../pages/leads/data/leadData";

export const useLeadsStore = create((set, get) => ({
  leads: initialLeads,
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
    total: initialLeads.length
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

  // Filters
  setFilter: (key, value) => set((state) => ({ 
    filters: { ...state.filters, [key]: value },
    pagination: { ...state.pagination, page: 1 }
  })),
  resetFilters: () => set({ 
    filters: { search: "", stage: "", status: "", city: "", dateRange: "", converted: "" },
    pagination: { ...get().pagination, page: 1 }
  }),
  
  // Pagination
  setPage: (page) => set((state) => ({ pagination: { ...state.pagination, page } })),
  setLimit: (limit) => set((state) => ({ pagination: { ...state.pagination, limit, page: 1 } })),

  // Selection
  toggleSelectAll: () => set((state) => {
    const filtered = get().getFilteredLeads();
    if (filtered.length === 0) return state;
    const allSelected = state.selectedLeads.length === filtered.length;
    return { selectedLeads: allSelected ? [] : filtered.map(l => l.id) };
  }),
  toggleSelect: (id) => set((state) => ({
    selectedLeads: state.selectedLeads.includes(id)
      ? state.selectedLeads.filter(lid => lid !== id)
      : [...state.selectedLeads, id]
  })),
  clearSelection: () => set({ selectedLeads: [] }),

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
      restaurantName: lead.restaurantName,
      address: lead.address?.fullAddress || "",
      city: lead.address?.city || "",
      state: lead.address?.state || "",
      pincode: lead.address?.pincode || "",
      adminName: lead.contactPerson,
      adminPhone: lead.phone,
      adminEmail: lead.email,
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

  // CRUD
  addLead: (lead) => {
    const newId = `LD-${String(get().leads.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    set((state) => ({
      leads: [{ 
        ...lead, 
        id: newId,
        stage: lead.stage || "prospect",
        status: lead.status || "active",
        createdAt: today,
        updatedAt: today,
        convertedRestaurantId: null,
        activity: [{ date: today, action: "Lead created" }]
      }, ...state.leads],
      showAddModal: false,
    }));
  },

  updateLead: (id, data) => set((state) => {
    const lead = state.leads.find(l => l.id === id);
    const today = new Date().toISOString().split('T')[0];
    const activity = [...(lead?.activity || [])];
    
    if (data.stage && data.stage !== lead?.stage) {
      const stageLabel = leadStages.find(s => s.value === data.stage)?.label || data.stage;
      activity.push({ date: today, action: `Stage changed to ${stageLabel}` });
    }
    if (data.status && data.status !== lead?.status) {
      activity.push({ date: today, action: `Status changed to ${data.status === 'active' ? 'Active' : 'Inactive'}` });
    }
    if (data.notes !== undefined && data.notes !== lead?.notes) {
      activity.push({ date: today, action: "Notes updated" });
    }
    
    return {
      leads: state.leads.map(l => l.id === id ? { 
        ...l, 
        ...data, 
        updatedAt: today,
        activity
      } : l),
      selectedLead: state.selectedLead?.id === id ? { 
        ...state.selectedLead, 
        ...data, 
        updatedAt: today,
        activity
      } : state.selectedLead,
      showAddModal: false,
      editingLead: null,
    };
  }),

  toggleStatus: (id) => set((state) => {
    const lead = state.leads.find(l => l.id === id);
    const newStatus = lead.status === "active" ? "inactive" : "active";
    const today = new Date().toISOString().split('T')[0];
    return {
      leads: state.leads.map(l => l.id === id ? { 
        ...l, 
        status: newStatus,
        updatedAt: today,
        activity: [...(l.activity || []), { date: today, action: `Status changed to ${newStatus === 'active' ? 'Active' : 'Inactive'}` }]
      } : l),
      selectedLead: state.selectedLead?.id === id ? { 
        ...state.selectedLead, 
        status: newStatus,
        updatedAt: today,
        activity: [...(state.selectedLead.activity || []), { date: today, action: `Status changed to ${newStatus === 'active' ? 'Active' : 'Inactive'}` }]
      } : state.selectedLead,
    };
  }),

  changeStage: (id, newStage) => {
    const today = new Date().toISOString().split('T')[0];
    set((state) => ({
      leads: state.leads.map(l => l.id === id ? { 
        ...l, 
        stage: newStage,
        updatedAt: today,
        activity: [...(l.activity || []), { date: today, action: `Stage changed to ${leadStages.find(s => s.value === newStage)?.label || newStage}` }]
      } : l),
      selectedLead: state.selectedLead?.id === id ? { 
        ...state.selectedLead, 
        stage: newStage,
        updatedAt: today,
        activity: [...(state.selectedLead.activity || []), { date: today, action: `Stage changed to ${leadStages.find(s => s.value === newStage)?.label || newStage}` }]
      } : state.selectedLead,
    }));
  },

  convertLead: (restaurantId) => set((state) => {
    const lead = state.selectedLead;
    const today = new Date().toISOString().split('T')[0];
    return {
      leads: state.leads.map(l => l.id === lead?.id ? { 
        ...l, 
        stage: "converted",
        status: "active",
        updatedAt: today,
        convertedRestaurantId: restaurantId,
        activity: [...(l.activity || []), { date: today, action: "Lead converted to Restaurant" }]
      } : l),
      selectedLead: state.selectedLead?.id === lead?.id ? { 
        ...state.selectedLead, 
        stage: "converted",
        status: "active",
        updatedAt: today,
        convertedRestaurantId: restaurantId,
        activity: [...(state.selectedLead.activity || []), { date: today, action: "Lead converted to Restaurant" }]
      } : state.selectedLead,
      showConvertModal: false,
    };
  }),

  getFilteredLeads: () => {
    const { leads, filters } = get();
    const today = new Date();
    
    return leads.filter(l => {
      const searchMatch = !filters.search || 
        l.restaurantName.toLowerCase().includes(filters.search.toLowerCase()) ||
        l.contactPerson.toLowerCase().includes(filters.search.toLowerCase()) ||
        l.phone.includes(filters.search) ||
        (l.email && l.email.toLowerCase().includes(filters.search.toLowerCase())) ||
        l.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        (l.address?.city && l.address.city.toLowerCase().includes(filters.search.toLowerCase()));
      
      const stageMatch = !filters.stage || l.stage === filters.stage;
      const statusMatch = !filters.status || l.status === filters.status;
      const cityMatch = !filters.city || (l.address?.city && l.address.city.toLowerCase() === filters.city.toLowerCase());
      const convertedMatch = !filters.converted || 
        (filters.converted === "converted" && l.stage === "converted") ||
        (filters.converted === "not_converted" && l.stage !== "converted");
      
      let dateMatch = true;
      if (filters.dateRange) {
        const createdDate = new Date(l.createdAt);
        if (filters.dateRange === "today") {
          dateMatch = createdDate.toDateString() === today.toDateString();
        } else if (filters.dateRange === "this_week") {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          dateMatch = createdDate >= weekAgo;
        } else if (filters.dateRange === "this_month") {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          dateMatch = createdDate >= monthAgo;
        }
      }
      
      return searchMatch && stageMatch && statusMatch && cityMatch && convertedMatch && dateMatch;
    });
  }
}));