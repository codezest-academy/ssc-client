import axios from "axios";
import { useAuthStore } from "../store/auth";

const isServer = typeof window === 'undefined';
let baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Node.js (Server Components) requires absolute URLs. If a relative URL like `/api/v1` is provided,
// we must prepend the host. We default to localhost:5000 for server-to-server calls if not specified.
if (isServer && baseURL.startsWith('/')) {
  baseURL = process.env.INTERNAL_API_URL || `http://localhost:5000${baseURL}`;
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Auto-report 5xx server errors and network errors (0)
    // Avoid reporting 4xx errors as they are operational (e.g., bad request, unauthorized)
    if (
      originalRequest &&
      !originalRequest._isErrorReport && // Prevent infinite loops if reporting itself fails
      (error.response?.status >= 500 || !error.response)
    ) {
      // Lazy import to avoid circular dependency since error-reporter imports axios
      import('./error-reporter').then(({ reportClientError }) => {
        reportClientError({
          message: error.response 
            ? `API Error: ${error.response.status} on ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`
            : `Network Error on ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`,
          severity: 'HIGH',
          errorBoundary: 'api',
          stack: error.stack,
        });
      }).catch(err => {
        console.error("Failed to lazy load error-reporter", err);
      });
    }

    if (originalRequest && error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/auth/refresh`,
            {},
            { withCredentials: true }
          );
          
          const newAccessToken = response.data.data.accessToken;
          useAuthStore.getState().setToken(newAccessToken);
          
          processQueue(null, newAccessToken);
          
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(api(originalRequest));
        } catch (refreshError) {
          processQueue(refreshError, null);
          useAuthStore.getState().logout();
          window.location.href = "/login";
          reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      });
    }
    
    return Promise.reject(error);
  }
);
