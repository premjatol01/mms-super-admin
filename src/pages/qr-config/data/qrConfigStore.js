import { create } from "zustand";
import { qrConfigApi } from "./qrConfigApi";
import { MOCK_QR_CODES, MOCK_RESTAURANTS } from "./mockData";

// Falls back to mock data if the API isn't available yet (e.g. during
// standalone UI development before the backend endpoints exist).
export const useQrConfigStore = create((set, get) => ({
  qrCodes: [],
  restaurants: [],
  isLoading: false,
  error: null,

  fetchQrCodes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await qrConfigApi.list();
      const data = Array.isArray(response) ? response : (response?.data || response?.qrCodes || []);
      set({ qrCodes: data, isLoading: false });
    } catch {
      set({ qrCodes: MOCK_QR_CODES, isLoading: false });
    }
  },

  fetchRestaurants: async () => {
    try {
      const response = await qrConfigApi.listRestaurants();
      // Safely extract the array in case the API wraps it in an object
      const data = Array.isArray(response) ? response : (response?.data || response?.restaurants || []);
      set({ restaurants: data });
    } catch {
      set({ restaurants: MOCK_RESTAURANTS });
    }
  },

  addQrCode: async (payload) => {
    try {
      const created = await qrConfigApi.create(payload);
      set({ qrCodes: [created, ...get().qrCodes] });
      return created;
    } catch {
      // Local fallback so the UI stays usable without a backend.
      const fallback = {
        id: `qr_${Date.now()}`,
        name: payload.name,
        description: payload.description || "",
        imageUrl: payload.image ? URL.createObjectURL(payload.image) : "",
        assignment: payload.assignment,
        restaurantId:
          payload.assignment === "restaurant" ? payload.restaurantId : null,
        status: "active",
        createdAt: new Date().toISOString(),
      };
      set({ qrCodes: [fallback, ...get().qrCodes] });
      return fallback;
    }
  },

  updateQrCode: async (id, payload) => {
    try {
      const updated = await qrConfigApi.update(id, payload);
      set({
        qrCodes: get().qrCodes.map((qr) => (qr.id === id ? updated : qr)),
      });
      return updated;
    } catch {
      set({
        qrCodes: get().qrCodes.map((qr) =>
          qr.id === id
            ? {
                ...qr,
                name: payload.name,
                description: payload.description || "",
                imageUrl: payload.image
                  ? URL.createObjectURL(payload.image)
                  : qr.imageUrl,
                assignment: payload.assignment,
                restaurantId:
                  payload.assignment === "restaurant"
                    ? payload.restaurantId
                    : null,
              }
            : qr
        ),
      });
    }
  },

  toggleStatus: async (id) => {
    const target = get().qrCodes.find((qr) => qr.id === id);
    if (!target) return;
    const nextStatus = target.status === "active" ? "inactive" : "active";
    try {
      await qrConfigApi.setStatus(id, nextStatus);
    } catch {
      // Swallow the network error in local/dev fallback mode; state still updates below.
    }
    set({
      qrCodes: get().qrCodes.map((qr) =>
        qr.id === id ? { ...qr, status: nextStatus } : qr
      ),
    });
  },
}));
