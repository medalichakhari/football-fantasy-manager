import axios, { AxiosInstance, AxiosResponse } from "axios";
import { useAuthStore } from "../store/authStore";

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();

export const handleApiResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data;
};

export const handleApiError = (error: any): never => {
  const message =
    error.response?.data?.error ||
    error.message ||
    "An unexpected error occurred";
  throw new Error(message);
};
