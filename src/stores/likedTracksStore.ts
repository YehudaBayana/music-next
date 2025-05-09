// stores/likedTracksStore.ts
import { create } from 'zustand';
import { spotifyClient } from '@/api/spotifyClient';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LikedTracksState {
  likedTrackIds: Set<string>;
  isTrackLiked: (trackId: string) => boolean;
  setTrackLiked: (trackId: string, isLiked: boolean) => void;
  toggleTrackLiked: (trackId: string) => Promise<boolean>;
  initializeLikedTracks: (trackIds: string[]) => void;
  clearLikedTracks: () => void;
}

// Create a custom storage that can serialize/deserialize Set
const customStorage = createJSONStorage(() => localStorage, {
  reviver: (key, value) => {
    // When key is 'likedTrackIds', convert array to Set
    if (key === 'likedTrackIds' && Array.isArray(value)) {
      return new Set(value);
    }
    return value;
  },
  replacer: (key, value) => {
    // When the value is a Set, convert it to an array
    if (value instanceof Set) {
      return Array.from(value);
    }
    return value;
  }
});

export const useLikedTracksStore = create<LikedTracksState>()(
  persist(
    (set, get) => ({
      likedTrackIds: new Set<string>(),
      
      isTrackLiked: (trackId: string) => {
        return get().likedTrackIds.has(trackId);
      },
      
      setTrackLiked: (trackId: string, isLiked: boolean) => {
        set((state) => {
          const newLikedTrackIds = new Set(state.likedTrackIds);
          
          if (isLiked) {
            newLikedTrackIds.add(trackId);
          } else {
            newLikedTrackIds.delete(trackId);
          }
          
          return { likedTrackIds: newLikedTrackIds };
        });
      },
      
      toggleTrackLiked: async (trackId: string) => {
        const currentlyLiked = get().isTrackLiked(trackId);
        const newLikedState = !currentlyLiked;
        
        // Optimistic update
        get().setTrackLiked(trackId, newLikedState);
        
        try {
          if (newLikedState) {
            await spotifyClient.saveTrack([trackId]);
          } else {
            await spotifyClient.removeSavedTrack([trackId]);
          }
          return newLikedState;
        } catch (error) {
          // Revert on error
          get().setTrackLiked(trackId, currentlyLiked);
          throw error;
        }
      },
      
      initializeLikedTracks: (trackIds: string[]) => {
        set({ likedTrackIds: new Set(trackIds) });
      },
      
      clearLikedTracks: () => {
        set({ likedTrackIds: new Set() });
      },
    }),
    {
      name: 'liked-tracks-storage',
      storage: customStorage,
    }
  )
);
