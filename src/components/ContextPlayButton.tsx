'use client';
import { usePlayer } from '@/context/PlayerContext';
import React from 'react';
// import { FaPlay } from 'react-icons/fa';

const ContextPlayButton = ({
  contextUri,
  trackUri,
}: {
  contextUri: string;
  trackUri: string;
}) => {
  const { playTrack } = usePlayer();
  return (
    // <div className='absolute inset-0 flex items-end justify-start ml-6 mb-6'>
    <div
      className='w-16 h-16 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80'
      onClick={() =>
        playTrack({
          context_uri: contextUri,
          offset: {
            uri: trackUri,
          },
        })
      }
    >
      <svg
        className='w-8 h-8 text-black'
        fill='currentColor'
        viewBox='0 0 24 24'
      >
        <path d='M8 5v14l11-7z'></path>
      </svg>
    </div>
    // </div>
    // <button
    //   className='bg-primary hover:bg-bgPrimary px-4 py-2 rounded-full flex items-center space-x-2 text-sm font-semibold'
    //   onClick={() =>
    //     playTrack({
    //       context_uri: contextUri,
    //       offset: {
    //         uri: trackUri,
    //       },
    //     })
    //   }
    // >
    //   <FaPlay className='w-4 h-4' />
    //   <span>Play</span>
    // </button>
  );
};

export default ContextPlayButton;
