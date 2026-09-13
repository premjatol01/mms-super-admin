import { create } from "zustand";
import {
  initialAvailability,
  initialAllocation,
  initialRules,
  initialPricing,
  initialTemplates,
} from "./mockData";

// Simulated network latency for mock fetch/save calls.
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let templateIdCounter = initialTemplates.length + 1;

const buildSnapshot = (state) => ({
  availability: state.availability,
  allocation: state.allocation,
  rules: state.rules,
  pricing: state.pricing,
});

export const useQrConfigStore = create((set, get) => ({
  // ----- Data -----
  availability: initialAvailability,
  allocation: initialAllocation,
  rules: initialRules,
  pricing: initialPricing,
  templates: [],

  // ----- Async / UX state -----
  loading: true,
  loadError: null,
  saving: false,
  saveError: null,

  // Snapshot of last-saved config, used for Reset + dirty check
  savedSnapshot: null,
  isDirty: false,

  // Template list UX state
  templateSearch: "",
  templateTypeFilter: "All",
  templateStatusFilter: "All",
  templatePage: 1,
  templatePageSize: 6,

  // Modal state
  confirmModal: null, // { title, description, confirmLabel, onConfirm }
  showUnsavedModal: false,
  pendingNavigationAction: null,
  templateFormModal: null, // { mode: 'create' | 'edit', template }
  templateDetailsModal: null, // template object

  // ----- Fetch -----
  fetchConfig: async () => {
    set({ loading: true, loadError: null });
    try {
      await delay(600);
      const availability = initialAvailability;
      const allocation = initialAllocation;
      const rules = initialRules;
      const pricing = initialPricing;
      set({
        availability,
        allocation,
        rules,
        pricing,
        templates: initialTemplates,
        loading: false,
        savedSnapshot: { availability, allocation, rules, pricing },
        isDirty: false,
      });
    } catch {
      set({ loading: false, loadError: "Unable to load QR configuration." });
    }
  },

  // ----- Field setters (mark dirty) -----
  setAvailability: (key, enabled) =>
    set((state) => {
      const availability = {
        ...state.availability,
        [key]: { ...state.availability[key], enabled },
      };
      return { availability, isDirty: true };
    }),

  setAllocation: (packageKey, value) =>
    set((state) => ({
      allocation: { ...state.allocation, [packageKey]: value },
      isDirty: true,
    })),

  setRule: (key, enabled) =>
    set((state) => ({
      rules: { ...state.rules, [key]: enabled },
      isDirty: true,
    })),

  setPricing: (patch) =>
    set((state) => ({
      pricing: { ...state.pricing, ...patch },
      isDirty: true,
    })),

  // ----- Save / Reset -----
  saveConfig: async () => {
    set({ saving: true, saveError: null });
    try {
      await delay(700);
      const state = get();
      set({
        saving: false,
        isDirty: false,
        savedSnapshot: buildSnapshot(state),
      });
      return { ok: true };
    } catch {
      set({ saving: false, saveError: "Unable to save QR configuration." });
      return { ok: false };
    }
  },

  resetChanges: () =>
    set((state) => {
      if (!state.savedSnapshot) return {};
      return { ...state.savedSnapshot, isDirty: false };
    }),

  // ----- Templates CRUD -----
  addTemplate: (template) =>
    set((state) => ({
      templates: [
        {
          id: `tpl_${templateIdCounter++}`,
          status: "Active",
          createdAt: new Date().toISOString().slice(0, 10),
          updatedAt: new Date().toISOString().slice(0, 10),
          ...template,
        },
        ...state.templates,
      ],
    })),

  updateTemplate: (id, patch) =>
    set((state) => ({
      templates: state.templates.map((t) =>
        t.id === id
          ? { ...t, ...patch, updatedAt: new Date().toISOString().slice(0, 10) }
          : t
      ),
    })),

  setTemplateStatus: (id, status) =>
    set((state) => ({
      templates: state.templates.map((t) =>
        t.id === id
          ? { ...t, status, updatedAt: new Date().toISOString().slice(0, 10) }
          : t
      ),
    })),

  // ----- Template list UX -----
  setTemplateSearch: (v) => set({ templateSearch: v, templatePage: 1 }),
  setTemplateTypeFilter: (v) => set({ templateTypeFilter: v, templatePage: 1 }),
  setTemplateStatusFilter: (v) =>
    set({ templateStatusFilter: v, templatePage: 1 }),
  setTemplatePage: (page) => set({ templatePage: page }),

  // ----- Modals -----
  openConfirm: (config) => set({ confirmModal: config }),
  closeConfirm: () => set({ confirmModal: null }),

  openUnsavedModal: (action) =>
    set({ showUnsavedModal: true, pendingNavigationAction: action }),
  closeUnsavedModal: () =>
    set({ showUnsavedModal: false, pendingNavigationAction: null }),

  openTemplateForm: (mode, template = null) =>
    set({ templateFormModal: { mode, template } }),
  closeTemplateForm: () => set({ templateFormModal: null }),

  openTemplateDetails: (template) => set({ templateDetailsModal: template }),
  closeTemplateDetails: () => set({ templateDetailsModal: null }),
}));
