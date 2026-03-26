import { apiClient } from './client';

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  email: string;
  displayName: string;
}

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<TokenResponse>('/api/auth/register', data).then((r) => r.data),

  login: (data: LoginRequest) =>
    apiClient.post<TokenResponse>('/api/auth/login', data).then((r) => r.data),

  refresh: (refreshToken: string) =>
    apiClient.post<{ accessToken: string }>('/api/auth/refresh', { refreshToken }).then((r) => r.data),

  logout: () => apiClient.post('/api/auth/logout'),
};
