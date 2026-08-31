import axios from 'axios';
import { API_BASE_URL } from './config';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
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
        localStorage.removeItem('shafigo_driver');
        localStorage.removeItem('swiftride_token');
        localStorage.removeItem('swiftride_user');
        localStorage.removeItem('swiftride_driver');
        window.location.href = '/login?expired=true';
      }
    }

    let message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred';

    if (error.code === 'ECONNABORTED' || message.includes('timeout')) {
      message = 'Server response took too long. If the backend is waking up on Render, please retry in a few seconds.';
    } else if (error.message === 'Network Error') {
      message = 'Cannot connect to ShafiGo backend. Please check your internet connection or verify the server status.';
    }

    return Promise.reject({
      status: error.response?.status,
      message,
      data: error.response?.data?.data || null,
      errors: error.response?.data?.errors || null,
    });
  }
);

export default axiosClient;
