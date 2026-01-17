import api from "./axios";

export const createOrder = (data, token) =>
  api.post("/orders", data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const fetchMyOrders = token =>
  api.get("/orders/my", {
    headers: { Authorization: `Bearer ${token}` }
  });
