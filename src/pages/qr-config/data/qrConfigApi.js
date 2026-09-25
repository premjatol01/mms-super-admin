import axios from "axios";

// Adjust the base URL to match how the rest of the app configures axios
// (e.g. import a shared `apiClient` instance instead, if one exists).
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

export const qrConfigApi = {
  list: () => client.get("/qr-configs").then((res) => res.data),

  create: (payload) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("description", payload.description || "");
    formData.append("assignment", payload.assignment);
    if (payload.assignment === "restaurant") {
      formData.append("restaurantId", payload.restaurantId);
    }
    if (payload.image) {
      formData.append("image", payload.image);
    }
    return client
      .post("/qr-configs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },

  update: (id, payload) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("description", payload.description || "");
    formData.append("assignment", payload.assignment);
    if (payload.assignment === "restaurant") {
      formData.append("restaurantId", payload.restaurantId);
    }
    if (payload.image) {
      formData.append("image", payload.image);
    }
    return client
      .put(`/qr-configs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },

  setStatus: (id, status) =>
    client.patch(`/qr-configs/${id}/status`, { status }).then((res) => res.data),

  listRestaurants: () =>
    client.get("/restaurants").then((res) => res.data),
};
