import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CategoryItem {
  id: number;
  name: string;
  hostName: string;
  parentId: number;
  recentVideos: number;
  mostViewed: number;
  isAds: boolean;
  defaultAdsStrategy: string;
  defaultAdsIntervalTime: number;
  vastAdsUriOtt: string | null;
  updatedAt: string;
  domainUrl: string;
  brandedUrl: string;
}

type ChannelState = {
  selectedChannel: CategoryItem | null;
  isHydrated: boolean;
  setChannel: (channel: CategoryItem) => Promise<void>;
  removeChannel: () => Promise<void>;
  loadChannel: () => Promise<void>;
};

export const useChannelStore = create<ChannelState>((set, get) => ({
  selectedChannel: null,
  isHydrated: false,

  setChannel: async (channel) => {
    await AsyncStorage.setItem('selectedChannel', JSON.stringify(channel));
    set({ selectedChannel: channel });
  },

  removeChannel: async () => {
    await AsyncStorage.removeItem('selectedChannel');
    set({ selectedChannel: null });
  },

  loadChannel: async () => {
    try {
      const value = await AsyncStorage.getItem('selectedChannel');
      set({
        selectedChannel: value ? JSON.parse(value) : null,
        isHydrated: true,
      });
    } catch (e) {
      set({ selectedChannel: null, isHydrated: true });
    }
  },
}));