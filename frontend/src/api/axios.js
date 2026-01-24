import axios from "axios";
import { getCsrfToken, clearCsrfToken } from "../utils/csrf";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
});

// Request interceptor - add token to all requests
api.interceptors.request.use(
  async (config) => {
    try {
      const authData = localStorage.getItem("auth");
      if (authData) {
        const parsed = JSON.parse(authData);
        if (parsed && parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }

      // Add CSRF token for state-changing requests
      const methodsNeedingCsrf = ['POST', 'PUT', 'DELETE', 'PATCH'];
      if (methodsNeedingCsrf.includes(config.method.toUpperCase())) {
        try {
          const csrfToken = await getCsrfToken();
          config.headers['CSRF-Token'] = csrfToken;
        } catch (csrfError) {
          console.error('Failed to get CSRF token:', csrfError);
          // Continue without CSRF token - server will reject if needed
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
  async (error) => {
    // If we get a 401 (unauthorized) response, the token is invalid or expired
    if (error.response?.status === 401) {
      // Clear the invalid token
      localStorage.removeItem("auth");
      clearCsrfToken();
      
      // Redirect to login if we're not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // If CSRF token is invalid, try to refresh it once
    if (error.response?.status === 403 && error.response?.data?.code === 'INVALID_CSRF_TOKEN') {
      if (!error.config._csrfRetry) {
        error.config._csrfRetry = true;
        clearCsrfToken();
        try {
          const csrfToken = await getCsrfToken();
          error.config.headers['CSRF-Token'] = csrfToken;
          return api.request(error.config);
        } catch (csrfError) {
          console.error('Failed to refresh CSRF token:', csrfError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
