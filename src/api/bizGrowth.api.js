import axiosClient from "./axiosClient";

export const bizGrowthApi = {
  getAll: (params) => axiosClient.get("/biz-growth/admin", { params }),
  getById: (id) => axiosClient.get(`/biz-growth/admin/${id}`),
  create: (data) => {
    const config = data instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
    return axiosClient.post("/biz-growth/admin", data, config);
  },
  update: (id, data) => {
    const config = data instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
    return axiosClient.put(`/biz-growth/admin/${id}`, data, config);
  },
  delete: (id) => axiosClient.delete(`/biz-growth/admin/${id}`),
  toggleStatus: (id) => axiosClient.patch(`/biz-growth/admin/${id}/status`),
};
