import axios from "axios";
import { getCsrfToken } from "../utils/csrf";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  withCredentials: true, // Enable sending cookies with requests
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to all requests
api.interceptors.request.use(
  async (config) => {
    try {
      // Add authentication token
      const authData = localStorage.getItem("auth");
      if (authData) {
        const parsed = JSON.parse(authData);
        if (parsed && parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }

      // Add CSRF token for state-changing requests
      if (['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
        const csrfToken = await getCsrfToken();
        if (csrfToken) {
          config.headers['csrf-token'] = csrfToken;
        }
      }
    } catch (error) {
      console.error("Error in request interceptor:", error);
      // If there's an error parsing auth data, clear the invalid data
      if (error.message?.includes('auth')) {
        localStorage.removeItem("auth");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token expiration and CSRF errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Log detailed error information for debugging
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });
    
    const originalRequest = error.config;

    // If we get a 401 (unauthorized) response, the token is invalid or expired
    if (error.response?.status === 401) {
      // Clear the invalid token
      localStorage.removeItem("auth");
      
      // Redirect to login if we're not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // If we get a 403 with CSRF error, refresh token and retry once
    if (
      error.response?.status === 403 &&
      error.response?.data?.code === 'INVALID_CSRF_TOKEN' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      
      try {
        // Import clearCsrfToken and getCsrfToken dynamically to avoid circular dependency
        const { clearCsrfToken, getCsrfToken } = await import('../utils/csrf');
        
        // Clear old token and fetch new one
        clearCsrfToken();
        const newToken = await getCsrfToken();
        
        // Update the original request with new token
        originalRequest.headers['csrf-token'] = newToken;
        
        // Retry the request
        return api(originalRequest);
      } catch (csrfError) {
        console.error('Failed to refresh CSRF token:', csrfError);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
