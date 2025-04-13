import { Platform } from 'react-native';

// Use your computer's local IP address here
const LOCAL_IP = '10.52.54.213'; // Replace with your actual IP
const DEV_API_URL = `http://${LOCAL_IP}:3000`;
const PROD_API_URL = 'https://your-production-url.com';

export const getBaseUrl = () => {
  if (__DEV__) {
    return Platform.select({
      ios: DEV_API_URL,
      android: DEV_API_URL,
      default: DEV_API_URL,
    });
  }
  return PROD_API_URL;
};

export const getWsUrl = () => {
  const baseUrl = getBaseUrl();
  return baseUrl.replace(/^http/, 'ws');
};

export const API_CONFIG = {
  baseURL: getBaseUrl(),
  wsURL: getWsUrl(),
};

// For debugging
if (__DEV__) {
  console.log('API Base URL:', API_CONFIG.baseURL);
  console.log('WebSocket URL:', API_CONFIG.wsURL);
} 