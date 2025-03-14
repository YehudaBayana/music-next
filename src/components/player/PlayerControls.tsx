import { spotifyClient } from '@/api/spotify';
import { usePlayer } from '@/context/PlayerContext';
import { useSession } from 'next-auth/react';
import React from 'react';
import {
  IoPlaySkipBack,
  IoPlay,
  IoPlaySkipForward,
  IoShuffle,
  IoRepeat,
  IoPause,
} from 'react-icons/io5';

const PlayerControls = () => {
  const { isPlaying, playTrack, progress } = usePlayer();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  if (!accessToken) {
    return <p>no access token, please login</p>;
  }
  return (
    <div className='flex items-center space-x-4 text-black'>
      <IoShuffle className='w-6 h-6 cursor-pointer hover:text-gray-600' />
      <IoPlaySkipBack
        onClick={() => spotifyClient.skipToPrevious()}
        className='w-6 h-6 cursor-pointer hover:text-gray-600'
      />
      {isPlaying ? (
        <IoPause
          onClick={() => spotifyClient.pausePlayback()}
          className='w-10 h-10 cursor-pointer hover:text-gray-600'
        />
      ) : (
        <IoPlay
          onClick={() => playTrack({ position_ms: progress })}
          className='w-10 h-10 cursor-pointer hover:text-gray-600'
        />
      )}

      <IoPlaySkipForward
        onClick={() => spotifyClient.skipToNext()}
        className='w-6 h-6 cursor-pointer hover:text-gray-600'
      />
      <IoRepeat className='w-6 h-6 cursor-pointer hover:text-gray-600' />
    </div>
  );
};

export default PlayerControls;
