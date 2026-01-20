import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
});

// Request interceptor - add token to all requests
api.interceptors.request.use(
  (config) => {
    try {
      const authData = localStorage.getItem("auth");
      if (authData) {
        const parsed = JSON.parse(authData);
        if (parsed && parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch (error) {
      console.error("Error parsing auth data:", error);
      // If there's an error parsing, clear the invalid data
      localStorage.removeItem("auth");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 (unauthorized) response, the token is invalid or expired
    if (error.response?.status === 401) {
      // Clear the invalid token
      localStorage.removeItem("auth");
      
      // Redirect to login if we're not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
