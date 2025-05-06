'use client';
import { spotifyClient } from '@/api/spotifyClient';
import ContextPlayButton from '@/components/ContextPlayButton';
import PageInfo from '@/components/PageInfo';
import ReorderButton from '@/components/ReorderButton';
import { usePlayer } from '@/context/PlayerContext';
import React, { useEffect, useState } from 'react';

const Header = ({ tracksUris }: { tracksUris: string[] }) => {
  const { playTrack } = usePlayer();
  return (
    <PageInfo src={'/musicNote.svg'} alt={'heart image'}>
      <h1 className='text-gray-300 text-3xl sm:text-5xl font-bold'>
        Favorites
      </h1>
      <div
        className='w-16 h-16 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80'
        onClick={() =>
          playTrack({
            uris: tracksUris,
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
    </PageInfo>
  );
};

export default Header;
