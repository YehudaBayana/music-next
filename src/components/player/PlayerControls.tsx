'use client';
import { spotifyClient } from '@/api/spotifyClient';
import { usePlayer } from '@/context/PlayerContext';
import React, { useEffect } from 'react';
import {
  IoPlaySkipBack,
  IoPlay,
  IoPlaySkipForward,
  IoPause,
} from 'react-icons/io5';

const PlayerControls = () => {
  const { isPlaying, progress } = usePlayer();

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('nexttrack', async () => {
        await spotifyClient.skipToNext();
      });

      navigator.mediaSession.setActionHandler('previoustrack', async () => {
        await spotifyClient.skipToPrevious();
      });

      navigator.mediaSession.setActionHandler('play', async () => {
        if (isPlaying) {
          await spotifyClient.pausePlayback();
        } else {
          await spotifyClient.startPlayback();
        }
      });

      navigator.mediaSession.setActionHandler('pause', async () => {
        await spotifyClient.pausePlayback();
      });
    }
  }, [isPlaying]);

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await spotifyClient.pausePlayback();
        // No need to update state here - the polling in Player.tsx will handle this
      } else {
        await spotifyClient.startPlayback();
        // No need to update state here - the polling in Player.tsx will handle this
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const handleNext = async () => {
    try {
      await spotifyClient.skipToNext();
      // The polling in Player.tsx will update the UI with the new track
    } catch (error) {
      console.error('Error skipping to next track:', error);
    }
  };

  const handlePrevious = async () => {
    try {
      // If more than 3 seconds into a song, go back to the start of the song
      if (progress > 3000) {
        await spotifyClient.seekToPosition(0);
      } else {
        await spotifyClient.skipToPrevious();
      }
      // The polling in Player.tsx will update the UI
    } catch (error) {
      console.error('Error with previous track action:', error);
    }
  };

  return (
    <div className='flex items-center space-x-4 text-black'>
      <IoPlaySkipBack
        onClick={handlePrevious}
        className='w-6 h-6 cursor-pointer hover:text-gray-600'
      />
      {isPlaying ? (
        <IoPause
          onClick={handlePlayPause}
          className='w-10 h-10 cursor-pointer hover:text-gray-600'
        />
      ) : (
        <IoPlay
          onClick={handlePlayPause}
          className='w-10 h-10 cursor-pointer hover:text-gray-600'
        />
      )}

      <IoPlaySkipForward
        onClick={handleNext}
        className='w-6 h-6 cursor-pointer hover:text-gray-600'
      />
    </div>
  );
};

export default PlayerControls;
