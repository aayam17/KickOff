import api from "./axios";

export const createPaymentIntent = (data) => api.post("/payments/create-intent", data);
export const confirmPayment = (data) => api.post("/payments/confirm", data);