import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  email: string | null;
  displayName: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setTokens: (access: string, refresh: string) => Promise<void>;
  setUser: (userId: string, email: string, displayName: string) => void;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

const ACCESS_KEY = 'cupplesx_access_token';
const REFRESH_KEY = 'cupplesx_refresh_token';
const USER_ID_KEY = 'cupplesx_user_id';

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  userId: null,
  email: null,
  displayName: null,
  isAuthenticated: false,
  isLoading: true,

  setTokens: async (access, refresh) => {
    await SecureStore.setItemAsync(ACCESS_KEY, access);
    await SecureStore.setItemAsync(REFRESH_KEY, refresh);
    set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
  },

  setUser: (userId, email, displayName) => {
    SecureStore.setItemAsync(USER_ID_KEY, userId);
    set({ userId, email, displayName });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
    await SecureStore.deleteItemAsync(USER_ID_KEY);
    set({
      accessToken: null,
      refreshToken: null,
      userId: null,
      email: null,
      displayName: null,
      isAuthenticated: false,
    });
  },

  loadFromStorage: async () => {
    try {
      const access = await SecureStore.getItemAsync(ACCESS_KEY);
      const refresh = await SecureStore.getItemAsync(REFRESH_KEY);
      const userId = await SecureStore.getItemAsync(USER_ID_KEY);
      if (access && refresh) {
        set({ accessToken: access, refreshToken: refresh, userId, isAuthenticated: true });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
