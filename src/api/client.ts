import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('cupplesx_access_token');
  const userId = await SecureStore.getItemAsync('cupplesx_user_id');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (userId) config.headers['X-User-Id'] = userId;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refresh = await SecureStore.getItemAsync('cupplesx_refresh_token');
      if (refresh) {
        try {
          const res = await axios.post(`${BASE_URL}/api/auth/refresh`, { refreshToken: refresh });
          const { accessToken } = res.data;
          await SecureStore.setItemAsync('cupplesx_access_token', accessToken);
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient.request(error.config);
        } catch {
          await SecureStore.deleteItemAsync('cupplesx_access_token');
          await SecureStore.deleteItemAsync('cupplesx_refresh_token');
        }
      }
    }
    return Promise.reject(error);
  }
);
