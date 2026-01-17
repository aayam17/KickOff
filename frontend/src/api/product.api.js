import api from "./axios";

export const fetchProducts = () => api.get("/products");

export const createProduct = (data, token) =>
  api.post("/admin/products", data, {
    headers: { Authorization: `Bearer ${token}` }
  });
