import axios from 'axios';
import { API_CONFIG } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
  validateStatus: (status) => status >= 200 && status < 300,
});

if (__DEV__) {
  api.interceptors.request.use(request => {
    console.log('API Request Details:', {
      fullUrl: `${request.baseURL}${request.url}`,
      method: request.method,
      headers: request.headers,
      data: request.data,
      timeout: request.timeout,
    });
    return request;
  });

  api.interceptors.response.use(
    response => {
      console.log('API Response Details:', {
        url: response.config.url,
        fullUrl: `${response.config.baseURL}${response.config.url}`,
        status: response.status,
        data: response.data,
        headers: response.headers,
        time: response.headers['x-response-time'],
      });
      return response;
    },
    error => {
      if (error.code === 'ECONNABORTED') {
        console.error('API Error: Request timed out after', error.config?.timeout, 'ms');
        console.error('Request URL:', `${error.config?.baseURL}${error.config?.url}`);
      } else if (error.code === 'ECONNREFUSED') {
        console.error('API Error: Connection refused. Server might not be running at:', API_CONFIG.baseURL);
      } else if (error.response) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      } else {
        console.error('API Error:', {
          message: error.message,
          code: error.code,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL,
          },
        });
      }
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