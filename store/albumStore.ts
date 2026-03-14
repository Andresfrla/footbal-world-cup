import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sticker, StickerStatus } from '../src/types';
import { initialAlbum } from '../src/data';

// Fallback storage para web
const safeStorage = {
  getItem: async (name: string) => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(name);
      }
      return await AsyncStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(name, value);
        return;
      }
      await AsyncStorage.setItem(name, value);
    } catch {
      // Ignore errors
    }
  },
  removeItem: async (name: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(name);
        return;
      }
      await AsyncStorage.removeItem(name);
    } catch {
      // Ignore errors
    }
  },
};

interface AlbumStore {
  stickers: Sticker[];
  
  initializeAlbum: () => void;
  toggleSticker: (id: number) => void;
  addDuplicate: (id: number) => void;
  removeDuplicate: (id: number) => void;
  setMissing: (id: number) => void;
  
  totalOwned: () => number;
  totalMissing: () => number;
  totalDuplicates: () => number;
  progressPercentage: () => number;
}

export const useAlbumStore = create<AlbumStore>()(
  persist(
    (set, get) => ({
      stickers: initialAlbum.stickers,

      initializeAlbum: () => {
        set({ stickers: initialAlbum.stickers });
      },

      toggleSticker: (id: number) => {
        set((state) => ({
          stickers: state.stickers.map((sticker) => {
            if (sticker.id !== id) return sticker;

            const newStatus: StickerStatus = sticker.status === 'missing' ? 'owned' : 'missing';

            return { ...sticker, status: newStatus };
          }),
        }));
      },

      addDuplicate: (id: number) => {
        set((state) => ({
          stickers: state.stickers.map((sticker) =>
            sticker.id === id ? { ...sticker, status: 'owned', duplicates: sticker.duplicates + 1 } : sticker
          ),
        }));
      },

      removeDuplicate: (id: number) => {
        set((state) => ({
          stickers: state.stickers.map((sticker) =>
            sticker.id === id ? { ...sticker, status: 'owned', duplicates: Math.max(0, sticker.duplicates - 1) } : sticker
          ),
        }));
      },

      setMissing: (id: number) => {
        set((state) => ({
          stickers: state.stickers.map((sticker) =>
            sticker.id === id ? { ...sticker, status: 'missing', duplicates: 0 } : sticker
          ),
        }));
      },

      totalOwned: () => {
        return get().stickers.filter((s) => s.status === 'owned').length;
      },

      totalMissing: () => {
        const total = get().stickers.length;
        const owned = get().stickers.filter((s) => s.status === 'owned').length;
        return total - owned;
      },

      totalDuplicates: () => {
        return get().stickers.reduce((acc, s) => acc + s.duplicates, 0);
      },

      progressPercentage: () => {
        const { stickers } = get();
        if (stickers.length === 0) return 0;
        const owned = stickers.filter((s) => s.status === 'owned').length;
        return Math.round((owned / stickers.length) * 100);
      },
    }),
    {
      name: 'album-storage',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
