// store/authStore.ts
import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthState = {
  isLoggedIn: boolean;
  token: string | null;
  isHydrated: boolean;

  redirectRoute: string | null;
  redirectParams: any;

  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadAuth: () => Promise<void>;

  setRedirect: (route: string, params?: any) => void;
  clearRedirect: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  token: null,
  isHydrated: false,

  redirectRoute: null,
  redirectParams: null,

  login: async (token: string) => {
    await AsyncStorage.setItem('token', token);

    set({
      isLoggedIn: true,
      token,
    });
  },

  // 🚪 LOGOUT
  logout: async () => {
    await AsyncStorage.removeItem('token');

    set({
      isLoggedIn: false,
      token: null,
    });
  },

  loadAuth: async () => {
    const token = await AsyncStorage.getItem('token');

    set({
      isLoggedIn: !!token,
      token,
      isHydrated: true,
    });
  },

  setRedirect: (route, params = {}) =>
    set({
      redirectRoute: route,
      redirectParams: params,
    }),

  clearRedirect: () =>
    set({
      redirectRoute: null,
      redirectParams: null,
    }),
}));
