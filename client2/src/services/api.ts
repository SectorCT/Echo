import axios from 'axios';
import { API_CONFIG } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  validateStatus: (status) => status >= 200 && status < 300,
});

if (__DEV__) {
  api.interceptors.request.use(request => {
    console.log('API Request:', {
      url: request.url,
      method: request.method,
      headers: request.headers,
    });
    return request;
  });

  api.interceptors.response.use(
    response => {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
      return response;
    },
    error => {
      console.error('API Error:', {
        url: error.config?.url,
        message: error.message,
        response: error.response?.data,
      });
      return Promise.reject(error);
    }
  );
}

api.interceptors.request.use(async (config) => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await api.post('/auth/refresh_token', { refreshToken });
        const { accessToken } = response.data;
        await AsyncStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        throw refreshError;
      }
    }
    throw error;
  }
);

export default api; 