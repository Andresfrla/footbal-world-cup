import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sticker, Match, UserProgress } from '../types';

interface AlbumStore {
  stickers: Sticker[];
  matches: Match[];
  userProgress: UserProgress;
  
  addSticker: (stickerId: string) => void;
  removeSticker: (stickerId: string) => void;
  isStickerOwned: (stickerId: string) => boolean;
  getOwnedCount: () => number;
  getTotalCount: () => number;
}

export const useAlbumStore = create<AlbumStore>()(
  persist(
    (set, get) => ({
      stickers: [],
      matches: [],
      userProgress: {
        ownedStickers: [],
        totalStickers: 0,
        lastUpdated: new Date().toISOString(),
      },

      addSticker: (stickerId: string) => {
        const { userProgress } = get();
        if (!userProgress.ownedStickers.includes(stickerId)) {
          set({
            userProgress: {
              ...userProgress,
              ownedStickers: [...userProgress.ownedStickers, stickerId],
              lastUpdated: new Date().toISOString(),
            },
          });
        }
      },

      removeSticker: (stickerId: string) => {
        const { userProgress } = get();
        set({
          userProgress: {
            ...userProgress,
            ownedStickers: userProgress.ownedStickers.filter((id) => id !== stickerId),
            lastUpdated: new Date().toISOString(),
          },
        });
      },

      isStickerOwned: (stickerId: string) => {
        return get().userProgress.ownedStickers.includes(stickerId);
      },

      getOwnedCount: () => {
        return get().userProgress.ownedStickers.length;
      },

      getTotalCount: () => {
        return get().userProgress.totalStickers;
      },
    }),
    {
      name: 'album-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
