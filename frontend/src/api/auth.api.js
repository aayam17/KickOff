import api from "./axios";

export const login = (data) => api.post("/auth/login", data);
export const verifyOTP = (data) => api.post("/auth/verify-otp", data);
