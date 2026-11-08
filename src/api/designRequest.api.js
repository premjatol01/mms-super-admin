import axiosClient from "./axiosClient";

export const designRequestApi = {
  getAllRequests: () => axiosClient.get("/design-requests/all"),
  updateStatus: (id, payload) => {
    if (payload instanceof FormData) {
      return axiosClient.put(`/design-requests/${id}/status`, payload);
    }
    return axiosClient.put(`/design-requests/${id}/status`, typeof payload === "string" ? { status: payload } : payload);
  },
};
