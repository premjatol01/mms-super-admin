import { create } from "zustand";
import { subscriptionsAPI } from "../api/subscriptions";
import { toast } from "sonner";

export const useSubscriptionsStore = create((set, get) => ({
  activeTab: "subscriptions", // "subscriptions" | "tickets" | "paymentConfig"
  subscriptions: [],
  loading: false,
  error: null,
  summary: {
    total: 0,
    active: 0,
    expiring: 0,
    expired: 0,
    pendingVerification: 0,
  },
  filters: {
    search: "",
    status: "",
    package: "",
    duration: "",
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },

  // Payment Verification Modal State
  verifyingPayment: null,
  showVerifyPaymentModal: false,

  // Support Tickets State
  tickets: [],
  ticketsLoading: false,
  ticketFilter: "",

  // Payment Config State
  paymentConfig: null,
  configLoading: false,

  selectedSubscription: null,
  editingSubscription: null,
  showAssignModal: false,
  showDetailsDrawer: false,
  showConfirmModal: false,
  confirmAction: null,
  showRenewModal: false,
  showChangePackageModal: false,

  setActiveTab: (tab) => set({ activeTab: tab }),

  // Fetch subscriptions from API
  fetchSubscriptions: async () => {
    const { filters, pagination } = get();
    set({ loading: true, error: null });

    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.package) params.package = filters.package;
      if (filters.duration) params.duration = filters.duration;

      const res = await subscriptionsAPI.getSubscriptions(params);
      
      const rawList = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res)
        ? res
        : [];

      const normalizedSubs = rawList.map((s) => ({
        ...s,
        id: s._id || s.id,
      }));

      const totalCount = res?.pagination?.total ?? res?.data?.pagination?.total ?? normalizedSubs.length;
      const summaryData = res?.summary || res?.data?.summary || get().summary;

      set({
        subscriptions: normalizedSubs,
        pagination: {
          ...pagination,
          total: totalCount,
        },
        summary: summaryData,
        loading: false,
      });
    } catch (err) {
      console.error("Failed to fetch subscriptions:", err);
      set({ 
        loading: false, 
        error: err.response?.data?.message || err.message || "Failed to load subscriptions" 
      });
    }
  },

  // Filters
  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      pagination: { ...state.pagination, page: 1 },
    }));
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 },
    }));
  },

  resetFilters: () => {
    set({
      filters: { search: "", status: "", package: "", duration: "" },
      pagination: { ...get().pagination, page: 1 },
    });
  },

  // Pagination
  setPage: (page) => {
    set((state) => ({ pagination: { ...state.pagination, page } }));
  },

  setLimit: (limit) => {
    set((state) => ({ pagination: { ...state.pagination, limit, page: 1 } }));
  },

  // Payment Verification Modal Controls
  openVerifyPaymentModal: (paymentOrSub) => {
    // paymentOrSub can be a pendingPayment object or subscription containing pendingPayment
    const payment = paymentOrSub.pendingPayment || paymentOrSub;
    set({ verifyingPayment: payment, showVerifyPaymentModal: true });
  },

  closeVerifyPaymentModal: () => {
    set({ verifyingPayment: null, showVerifyPaymentModal: false });
  },

  reviewPayment: async (paymentRequestId, status, reviewNote = "") => {
    try {
      const res = await subscriptionsAPI.reviewPaymentRequest(paymentRequestId, { status, reviewNote });
      const msg = res?.message || (status === "confirmed" ? "Payment confirmed and subscription activated!" : "Payment rejected.");
      toast.success(msg);
      get().closeVerifyPaymentModal();
      await get().fetchSubscriptions();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to review payment request";
      toast.error(msg);
      return { success: false, message: msg };
    }
  },

  // Support Tickets
  fetchTickets: async () => {
    set({ ticketsLoading: true });
    try {
      const params = {};
      if (get().ticketFilter) params.status = get().ticketFilter;
      const res = await subscriptionsAPI.getTickets(params);
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      set({ tickets: list, ticketsLoading: false });
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      set({ ticketsLoading: false });
    }
  },

  setTicketFilter: (filter) => {
    set({ ticketFilter: filter });
    get().fetchTickets();
  },

  updateTicketStatus: async (ticketId, status, adminReply = "") => {
    try {
      const res = await subscriptionsAPI.updateTicket(ticketId, { status, adminReply });
      toast.success(res?.message || "Ticket updated successfully");
      await get().fetchTickets();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update ticket";
      toast.error(msg);
      return { success: false, message: msg };
    }
  },

  // Payment Config
  fetchPaymentConfig: async () => {
    set({ configLoading: true });
    try {
      const res = await subscriptionsAPI.getPaymentConfig();
      const cfg = res?.data || res || null;
      set({ paymentConfig: cfg, configLoading: false });
    } catch (err) {
      console.error("Failed to fetch payment config:", err);
      set({ configLoading: false });
    }
  },

  savePaymentConfig: async (formDataOrData) => {
    try {
      const res = await subscriptionsAPI.updatePaymentConfig(formDataOrData);
      toast.success(res?.message || "Payment settings updated successfully");
      await get().fetchPaymentConfig();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to save payment settings";
      toast.error(msg);
      return { success: false, message: msg };
    }
  },

  // Existing Modal controls
  openAssignModal: () => set({ showAssignModal: true, editingSubscription: null }),
  closeAssignModal: () => set({ showAssignModal: false, editingSubscription: null }),

  openDetails: (sub) => set({ selectedSubscription: sub, showDetailsDrawer: true }),
  closeDetails: () => set({ selectedSubscription: null, showDetailsDrawer: false }),

  showConfirm: (action, sub) => set({
    showConfirmModal: true,
    confirmAction: action,
    selectedSubscription: sub,
  }),

  hideConfirm: () => set({
    showConfirmModal: false,
    confirmAction: null,
    selectedSubscription: null,
  }),

  openRenewModal: (sub) => set({ showRenewModal: true, selectedSubscription: sub }),
  closeRenewModal: () => set({ showRenewModal: false }),

  openChangePackageModal: (sub) => set({ showChangePackageModal: true, selectedSubscription: sub }),
  closeChangePackageModal: () => set({ showChangePackageModal: false }),

  assignSubscription: async (subData) => {
    try {
      const res = await subscriptionsAPI.assignSubscription(subData);
      const msg = res?.message || res?.data?.message || "Subscription assigned successfully";
      toast.success(msg);
      set({ showAssignModal: false });
      await get().fetchSubscriptions();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to assign subscription";
      toast.error(msg);
      return { success: false, message: msg };
    }
  },

  renewSubscription: async (id, durationOrData) => {
    try {
      const payload = typeof durationOrData === 'object' 
        ? durationOrData 
        : { duration: durationOrData, durationDays: durationOrData };
      const res = await subscriptionsAPI.renewSubscription(id, payload);
      const msg = res?.message || res?.data?.message || "Subscription renewed successfully";
      toast.success(msg);
      set({ showRenewModal: false });
      await get().fetchSubscriptions();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to renew subscription";
      toast.error(msg);
      return { success: false, message: msg };
    }
  },

  changePackage: async (id, newPackageNameOrData) => {
    try {
      const payload = typeof newPackageNameOrData === 'object'
        ? newPackageNameOrData
        : { packageName: newPackageNameOrData };
      const res = await subscriptionsAPI.changePackage(id, payload);
      const msg = res?.message || res?.data?.message || "Package changed successfully";
      toast.success(msg);
      set({ showChangePackageModal: false });
      await get().fetchSubscriptions();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to change package";
      toast.error(msg);
      return { success: false, message: msg };
    }
  },

  cancelSubscription: async (id) => {
    try {
      const res = await subscriptionsAPI.cancelSubscription(id);
      const msg = res?.message || res?.data?.message || "Subscription cancelled";
      toast.success(msg);
      set({ showConfirmModal: false, showDetailsDrawer: false });
      await get().fetchSubscriptions();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to cancel subscription";
      toast.error(msg);
      return { success: false, message: msg };
    }
  },

  reactivateSubscription: async (id) => {
    try {
      const res = await subscriptionsAPI.reactivateSubscription(id);
      const msg = res?.message || res?.data?.message || "Subscription reactivated successfully";
      toast.success(msg);
      set({ showConfirmModal: false, showDetailsDrawer: false });
      await get().fetchSubscriptions();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to reactivate subscription";
      toast.error(msg);
      return { success: false, message: msg };
    }
  },
}));
