'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useLikedTracksStore } from '@/stores/likedTracksStore';
import { spotifyClient } from '@/api/spotifyClient';

/**
 * This component initializes the liked tracks store by fetching
 * the user's saved tracks from Spotify API.
 * 
 * It should be rendered once at a high level in the component tree.
 */
const LikedTracksInitializer = () => {
  const { data: session } = useSession();
  const { initializeLikedTracks, clearLikedTracks } = useLikedTracksStore();

  useEffect(() => {
    let isMounted = true;

    const fetchLikedTracks = async () => {
      if (!session?.accessToken) {
        clearLikedTracks();
        return;
      }

      try {
        // Fetch the user's saved tracks, limited to the most recent 50
        // Note: We're not implementing pagination here for simplicity,
        // but in a real app, you might want to fetch more tracks
        const savedTracks = await spotifyClient.getSavedTracks({ limit: 50 });
        
        if (isMounted && savedTracks?.items) {
          // Extract the track IDs and initialize the store
          const trackIds = savedTracks.items.map(item => item.track.id);
          initializeLikedTracks(trackIds);
        }
      } catch (error) {
        console.error('Error fetching liked tracks:', error);
        if (isMounted) {
          clearLikedTracks();
        }
      }
    };

    // Only fetch if we have an access token
    if (session?.accessToken) {
      fetchLikedTracks();
    } else {
      clearLikedTracks();
    }

    return () => {
      isMounted = false;
    };
  }, [session?.accessToken, initializeLikedTracks, clearLikedTracks]);

  // This component doesn't render anything
  return null;
};

export default LikedTracksInitializer;
