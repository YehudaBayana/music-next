'use client';
import CurrentPlayingSong from '@/components/player/CurrentPlayingTrack';
import PlayerControls from '@/components/player/PlayerControls';
import SearchBar from '@/components/player/SearchBar';
import React from 'react';

const Player = () => {
  return (
    <div className='bg-secondary p-3 w-full sm:w-[calc(100vw-16rem)] sm:left-64 left-0 right-0 bottom-0 sm:bottom-auto sm:top-0 fixed z-10 max-w-full shadow-md flex flex-col-reverse sm:flex-row items-center justify-between'>
      <PlayerControls />
      <CurrentPlayingSong />
      <SearchBar />
    </div>
  );
};

export default Player;
