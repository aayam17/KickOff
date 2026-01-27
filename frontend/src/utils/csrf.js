import axios from 'axios';

// Store CSRF token in memory
let csrfToken = null;

// Create a separate axios instance without interceptors for fetching CSRF token
const csrfAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  withCredentials: true,
});

/**
 * Fetch CSRF token from server
 * @returns {Promise<string>} CSRF token
 */
export const fetchCsrfToken = async () => {
  try {
    // Use the plain axios instance to avoid interceptor loops
    const response = await csrfAxios.get('/security/csrf-token');
    if (response.data.success && response.data.csrfToken) {
      csrfToken = response.data.csrfToken;
      return csrfToken;
    }
    throw new Error('Failed to fetch CSRF token');
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};

/**
 * Get current CSRF token (fetch if not available)
 * @returns {Promise<string>} CSRF token
 */
export const getCsrfToken = async () => {
  if (!csrfToken) {
    await fetchCsrfToken();
  }
  return csrfToken;
};

/**
 * Clear stored CSRF token (e.g., on logout)
 */
export const clearCsrfToken = () => {
  csrfToken = null;
};

/**
 * Add CSRF token to request headers
 * @param {Object} config - Axios config object
 * @returns {Promise<Object>} Updated config with CSRF token
 */
export const addCsrfToken = async (config) => {
  const token = await getCsrfToken();
  if (token) {
    config.headers['CSRF-Token'] = token;
  }
  return config;
};
