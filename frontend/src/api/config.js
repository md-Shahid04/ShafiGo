/**
 * Centralized Application & API Configuration
 * Automatically switches between Local Development and Render Production.
 * Production builds on Vercel will NEVER use localhost.
 */

const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '0.0.0.0'
);

// Determine if we should force production backend endpoints
export const IS_PRODUCTION = import.meta.env.PROD || (!isLocalhost && isBrowser);

// Production endpoints
export const PROD_API_URL = 'https://shafigo-1.onrender.com/api';
export const PROD_WS_URL = 'https://shafigo-1.onrender.com/ws';

// Development endpoints
export const DEV_API_URL = 'http://localhost:8080/api';
export const DEV_WS_URL = 'http://localhost:8080/ws';

// Resolved base URLs
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (IS_PRODUCTION ? PROD_API_URL : DEV_API_URL);

// WebSocket URL for SockJS HTTP transport handshake
export const WS_BASE_URL =
  import.meta.env.VITE_WS_URL ||
  (IS_PRODUCTION ? PROD_WS_URL : DEV_WS_URL);

export default {
  IS_PRODUCTION,
  API_BASE_URL,
  WS_BASE_URL,
  PROD_API_URL,
  PROD_WS_URL,
  DEV_API_URL,
  DEV_WS_URL,
};
