import { create } from "zustand";
import { designRequestApi } from "../api/designRequest.api";

const norm = (doc) => {
  if (!doc) return doc;
  const { _id, __v, ...rest } = doc;
  return { ...rest, id: ((_id?._id ?? _id)?.toString?.() || _id || rest.id) };
};

export const useDesignRequestStore = create((set, get) => ({
  requests: [],
  loading: false,
  error: null,
  loaded: false,

  fetchRequests: async () => {
    if (get().loaded) return;
    set({ loading: true, error: null });
    try {
      const res = await designRequestApi.getAllRequests();
      set({ 
        requests: (res?.data || []).map(norm), 
        loading: false, 
        loaded: true 
      });
    } catch (err) {
      set({ loading: false, error: err.message || "Failed to load requests" });
    }
  },

  updateStatus: async (id, status) => {
    try {
      await designRequestApi.updateStatus(id, status);
      set((state) => ({
        requests: state.requests.map((r) => 
          r.id === id ? { ...r, status } : r
        ),
      }));
    } catch (err) {
      throw err;
    }
  }
}));
