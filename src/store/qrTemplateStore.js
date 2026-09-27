import { create } from "zustand";
import { qrTemplateAPI } from "../api/qrTemplateAPI";

export const useQRTemplateStore = create((set, get) => ({
  templates: [],
  loading: false,
  error: null,
  
  // Modals
  showUploadModal: false,
  showMapModal: false,
  selectedTemplate: null,

  // Fetch
  fetchTemplates: async () => {
    try {
      set({ loading: true, error: null });
      const res = await qrTemplateAPI.getTemplates();
      set({ templates: res.data || res, loading: false }); // handle axios wrapper
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Actions
  uploadTemplate: async (formData) => {
    try {
      set({ loading: true, error: null });
      await qrTemplateAPI.uploadTemplate(formData);
      set({ showUploadModal: false });
      await get().fetchTemplates();
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateTemplate: async (id, data) => {
    try {
      set({ loading: true, error: null });
      await qrTemplateAPI.updateTemplate(id, data);
      set({ showMapModal: false });
      await get().fetchTemplates();
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteTemplate: async (id) => {
    try {
      set({ loading: true, error: null });
      await qrTemplateAPI.deleteTemplate(id);
      await get().fetchTemplates();
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // UI Controls
  openUploadModal: () => set({ showUploadModal: true }),
  closeUploadModal: () => set({ showUploadModal: false }),
  
  openMapModal: (template) => set({ showMapModal: true, selectedTemplate: template }),
  closeMapModal: () => set({ showMapModal: false, selectedTemplate: null }),
}));
