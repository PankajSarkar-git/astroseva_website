// src/api/api.ts
import axios from 'axios';
import skipAuthPaths from './skip-path';
import { getTokenFromStore } from '@/store/get-token';
import { showToast } from '@/components/showToast';

// const baseUrl =
//   process.env.BASE_URL || 'https://quagga-driving-socially.ngrok-free.app';
// const baseUrl = 'https://astrosevaa.com';
const baseUrl = 'https://backend.astrosevaa.com';
// const baseUrl =
//   process.env.BASE_URL || 'https://gorilla-fitting-feline.ngrok-free.app';

const api = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async config => {
    const urlPath = config.url || '';

    const shouldSkip = skipAuthPaths.some((path: string) =>
      urlPath.startsWith(path),
    );
    console.log('🔗 API Request:', {
      url: (config?.baseURL ?? '') + config?.url,
      method: config.method?.toUpperCase(),
      payload: config.data || null,
      params: config.params,
    });

    const token = shouldSkip ? '' : getTokenFromStore();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    showToast.error(error.message || 'Something went wrong');
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => response,
  error => {
    const message =
      error.response?.data?.msg || error.message || 'Something went wrong';

    showToast.error(message);

    return Promise.reject(error);
  },
);

export default api;
