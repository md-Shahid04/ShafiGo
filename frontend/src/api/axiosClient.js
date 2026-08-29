import axios from 'axios';

// Resolve API base URL with production-safe fallback
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://shafigo-1.onrender.com/api'
    : 'http://localhost:8080/api');

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shafigo_token') || localStorage.getItem('swiftride_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Errors
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized (expired token or invalid session)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('shafigo_token');
        localStorage.removeItem('shafigo_user');
        localStorage.removeItem('swiftride_token');
        localStorage.removeItem('swiftride_user');
        window.location.href = '/login?expired=true';
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred';

    return Promise.reject({
      status: error.response?.status,
      message,
      data: error.response?.data?.data || null,
      errors: error.response?.data?.errors || null,
    });
  }
);

export default axiosClient;
