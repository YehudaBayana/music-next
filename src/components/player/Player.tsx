'use client';
import { spotifyClient } from '@/api/spotifyClient';
import CurrentPlayingSong from '@/components/player/CurrentPlayingTrack';
import PlayerControls from '@/components/player/PlayerControls';
import SearchBar from '@/components/player/SearchBar';
import { useQueue } from '@/context/QueueContext';
import { usePlayer } from '@/context/PlayerContext';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';

const Player = () => {
  const { data: session } = useSession();
  const { openQueue } = useQueue();
  const { setCurrentTrack, setIsPlaying, setProgress } = usePlayer();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isInitialized, setIsInitialized] = useState(false);

  // Set access token when session changes
  useEffect(() => {
    if (session?.accessToken) {
      spotifyClient.setAccessToken(session.accessToken);
      console.log('Queue can be opened with:', openQueue);
      
      // Set a small delay before considering the app initialized
      // This helps ensure the Spotify Web Playback SDK has time to initialize
      setTimeout(() => {
        setIsInitialized(true);
      }, 3000);
    }
  }, [openQueue, session?.accessToken]);

  // Set up polling for currently playing track across devices
  useEffect(() => {
    const pollCurrentlyPlaying = async () => {
      if (!session?.accessToken) return;

      try {
        // Fetch the currently playing track from Spotify API
        const currentlyPlaying = await spotifyClient.getCurrentlyPlayingTrack();

        // Only update if we have valid data
        if (currentlyPlaying && currentlyPlaying.item) {
          // Update player state with the currently playing track
          setCurrentTrack(currentlyPlaying.item);
          setIsPlaying(currentlyPlaying.is_playing);
          setProgress(currentlyPlaying.progress_ms || 0);

          // Update media session metadata for browser media controls
          if (
            'mediaSession' in navigator &&
            currentlyPlaying.item.type === 'track'
          ) {
            try {
              const track = currentlyPlaying.item;
              navigator.mediaSession.metadata = new MediaMetadata({
                title: track.name,
                artist: track.artists.map((artist) => artist.name).join(', '),
                album: track.album?.name || '',
                artwork:
                  track.album?.images?.map((img) => ({
                    src: img.url,
                    sizes: `${img.width}x${img.height}`,
                    type: 'image/jpeg',
                  })) || [],
              });
            } catch (mediaError) {
              console.error(
                'Error setting media session metadata:',
                mediaError
              );
              // Continue execution even if media session fails
            }
          }
        } else if (currentlyPlaying && currentlyPlaying.is_playing === false) {
          // If nothing is playing, update the isPlaying state
          setIsPlaying(false);
        }
      } catch (error) {
        console.error('Error fetching currently playing track:', error);
        // Don't disrupt the user experience on API errors
        // Just log the error and continue polling
      }
    };

    // Only start polling once we're initialized and have an access token
    if (isInitialized && session?.accessToken) {
      // Poll immediately once initialized
      pollCurrentlyPlaying();
      
      // Set up polling interval (every 5 seconds)
      pollingIntervalRef.current = setInterval(pollCurrentlyPlaying, 5000);
      
      // Clean up interval on unmount or when dependencies change
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      };
    }
  }, [isInitialized, session?.accessToken, setCurrentTrack, setIsPlaying, setProgress]);

  return (
    <div
      className='bg-secondary p-3 w-full sm:w-[calc(100vw-16rem)] sm:left-64 left-0 right-0 bottom-0 sm:bottom-auto sm:top-0 fixed z-10 max-w-full shadow-md flex flex-col-reverse sm:flex-row items-center justify-between'
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          openQueue();
        }
      }}
    >
      <PlayerControls />
      <CurrentPlayingSong />
      <SearchBar />
    </div>
  );
};

export default Player;
