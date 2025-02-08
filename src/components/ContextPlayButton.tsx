'use client';
import { usePlayer } from '@/context/PlayerContext';
import React from 'react';
import { FaPlay } from 'react-icons/fa';

const ContextPlayButton = ({
  contextUri,
  trackUri,
}: {
  contextUri: string;
  trackUri: string;
}) => {
  const { playTrack } = usePlayer();
  return (
    <button
      className='bg-primary hover:bg-bgPrimary px-4 py-2 rounded-full flex items-center space-x-2 text-sm font-semibold'
      onClick={() =>
        playTrack({
          context_uri: contextUri,
          offset: {
            uri: trackUri,
          },
        })
      }
    >
      <FaPlay className='w-4 h-4' />
      <span>Play</span>
    </button>
  );
};

export default ContextPlayButton;
