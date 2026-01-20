import api from "./axios";

export const createOrder = (data) => api.post("/orders", data);
export const fetchMyOrders = () => api.get("/orders/my");