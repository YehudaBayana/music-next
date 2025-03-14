'use client';
import { spotifyClient } from '@/api/spotifyClient';
import CurrentPlayingSong from '@/components/player/CurrentPlayingTrack';
import PlayerControls from '@/components/player/PlayerControls';
import SearchBar from '@/components/player/SearchBar';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';

const Player = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.accessToken) {
      spotifyClient.setAccessToken(session.accessToken);
    }
  }, [session?.accessToken]);
  return (
    <div className='bg-secondary p-3 w-full sm:w-[calc(100vw-16rem)] sm:left-64 left-0 right-0 bottom-0 sm:bottom-auto sm:top-0 fixed z-10 max-w-full shadow-md flex flex-col-reverse sm:flex-row items-center justify-between'>
      <PlayerControls />
      <CurrentPlayingSong />
      <SearchBar />
    </div>
  );
};

export default Player;
