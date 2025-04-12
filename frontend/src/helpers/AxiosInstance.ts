// src/utils/axiosInstance.ts
import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

// Creamos una instancia básica
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    'X-Custom-Header': 'foobar',
    'Content-Type': 'multipart/form-data'
  },
});

// Interceptor para añadir el token dinámicamente antes de cada request
axiosInstance.interceptors.request.use((config) => {
  const authStore = useAuthStore();
// console.log('AuthStore:', authStore.token);

  if (authStore.token) {
    config.headers.Authorization = `${authStore.token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
