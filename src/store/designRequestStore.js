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

  fetchRequests: async (force = false) => {
    if (get().loaded && !force) return;
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

  updateStatus: async (id, payload) => {
    try {
      const res = await designRequestApi.updateStatus(id, payload);
      const updated = res?.data?.data ? norm(res.data.data) : null;
      set((state) => ({
        requests: state.requests.map((r) => {
          if (r.id !== id) return r;
          if (updated) return { ...r, ...updated };
          const status = typeof payload === "string" ? payload : payload?.status;
          return { ...r, ...(status ? { status } : {}) };
        }),
      }));
      return updated;
    } catch (err) {
      throw err;
    }
  }
}));
