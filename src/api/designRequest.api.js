import axiosClient from "./axiosClient";

export const designRequestApi = {
  getAllRequests: () => axiosClient.get("/design-requests/all"),
  updateStatus: (id, status) => axiosClient.put(`/design-requests/${id}/status`, { status }),
};
