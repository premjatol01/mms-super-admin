import { create } from "zustand";
import { initialFeatures } from "./mockData";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let idCounter = initialFeatures.length + 1;

export const useFeatureStore = create((set, get) => ({
  // ----- Data -----
  features: [],

  // ----- Async / UX state -----
  loading: true,
  loadError: null,

  // List UX state
  search: "",
  categoryFilter: "All",
  statusFilter: "All",
  sortBy: "displayOrder",
  sortDir: "asc",
  page: 1,
  pageSize: 8,

  // Modal state
  formModal: null, // { mode: 'create' | 'edit', feature }
  detailsModal: null, // feature object
  confirmModal: null, // { title, description, confirmLabel, tone, onConfirm }
  showUnsavedModal: false,
  pendingCloseAction: null,

  // ----- Fetch -----
  fetchFeatures: async () => {
    set({ loading: true, loadError: null });
    try {
      await delay(600);
      set({ features: initialFeatures, loading: false });
    } catch {
      set({ loading: false, loadError: "Unable to load features." });
    }
  },

  // ----- List UX setters -----
  setSearch: (v) => set({ search: v, page: 1 }),
  setCategoryFilter: (v) => set({ categoryFilter: v, page: 1 }),
  setStatusFilter: (v) => set({ statusFilter: v, page: 1 }),
  setSort: (field) =>
    set((state) => ({
      sortBy: field,
      sortDir: state.sortBy === field && state.sortDir === "asc" ? "desc" : "asc",
    })),
  setPage: (page) => set({ page }),

  // ----- CRUD -----
  addFeature: (feature) =>
    set((state) => ({
      features: [
        {
          id: `feat_${idCounter++}`,
          packages: [],
          updatedAt: new Date().toISOString().slice(0, 10),
          ...feature,
        },
        ...state.features,
      ],
    })),

  updateFeature: (id, patch) =>
    set((state) => ({
      features: state.features.map((f) =>
        f.id === id
          ? { ...f, ...patch, updatedAt: new Date().toISOString().slice(0, 10) }
          : f
      ),
    })),

  setFeatureStatus: (id, status) =>
    set((state) => ({
      features: state.features.map((f) =>
        f.id === id
          ? { ...f, status, updatedAt: new Date().toISOString().slice(0, 10) }
          : f
      ),
    })),

  isKeyTaken: (key, excludeId = null) => {
    const { features } = get();
    return features.some(
      (f) => f.key.toLowerCase() === key.toLowerCase() && f.id !== excludeId
    );
  },

  isNameTaken: (name, excludeId = null) => {
    const { features } = get();
    return features.some(
      (f) =>
        f.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        f.id !== excludeId
    );
  },

  // ----- Modals -----
  openForm: (mode, feature = null) => set({ formModal: { mode, feature } }),
  closeForm: () => set({ formModal: null }),

  openDetails: (feature) => set({ detailsModal: feature }),
  closeDetails: () => set({ detailsModal: null }),

  openConfirm: (config) => set({ confirmModal: config }),
  closeConfirm: () => set({ confirmModal: null }),

  openUnsavedModal: (action) =>
    set({ showUnsavedModal: true, pendingCloseAction: action }),
  closeUnsavedModal: () =>
    set({ showUnsavedModal: false, pendingCloseAction: null }),
}));
