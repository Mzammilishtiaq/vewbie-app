// store/authStore.ts
import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthState = {
  isLoggedIn: boolean;
  token: string | null;
  fullName: string | null;
  userName: string | null;
  email: string | null;
  status: string | null;
  isHydrated: boolean;

  redirectRoute: string | null;
  redirectParams: any;

  login: (authData: LoginPayload | string) => Promise<void>;
  logout: () => Promise<void>;
  loadAuth: () => Promise<void>;

  setRedirect: (route?: string, params?: any) => void;
  clearRedirect: () => void;
};

type LoginPayload = {
  token: string;
  fullName?: string;
  userName?: string;
  email?: string;
  status?: string;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  token: null,
  fullName: null,
  userName: null,
  email: null,
  status: null,
  isHydrated: false,

  redirectRoute: null,
  redirectParams: null,

  login: async (authData: LoginPayload | string) => {
    const payload: LoginPayload =
      typeof authData === 'string' ? {token: authData} : authData;

    const token = payload?.token;

    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem(
      'authUser',
      JSON.stringify({
        fullName: payload?.fullName ?? null,
        userName: payload?.userName ?? null,
        email: payload?.email ?? null,
        status: payload?.status ?? null,
      }),
    );

    set({
      isLoggedIn: true,
      token,
      fullName: payload?.fullName ?? null,
      userName: payload?.userName ?? null,
      email: payload?.email ?? null,
      status: payload?.status ?? null,
    });
  },

  // 🚪 LOGOUT
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('authUser');

    set({
      isLoggedIn: false,
      token: null,
      fullName: null,
      userName: null,
      email: null,
      status: null,
    });
  },

  loadAuth: async () => {
    const token = await AsyncStorage.getItem('token');
    const authUser = await AsyncStorage.getItem('authUser');
    const parsedAuthUser = authUser ? JSON.parse(authUser) : null;

    set({
      isLoggedIn: !!token,
      token,
      fullName: parsedAuthUser?.fullName ?? null,
      userName: parsedAuthUser?.userName ?? null,
      email: parsedAuthUser?.email ?? null,
      status: parsedAuthUser?.status ?? null,
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
