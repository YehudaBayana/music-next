'use client';
import { spotifyClient } from '@/api/spotifyClient';
import CurrentPlayingSong from '@/components/player/CurrentPlayingTrack';
import PlayerControls from '@/components/player/PlayerControls';
import SearchBar from '@/components/player/SearchBar';
import { useQueue } from '@/context/QueueContext';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';

const Player = () => {
  const { data: session } = useSession();
  const { openQueue } = useQueue();

  // Test for ESLint error: openQueue is used inside but not in deps array
  useEffect(() => {
    if (session?.accessToken) {
      spotifyClient.setAccessToken(session.accessToken);
      console.log('Queue can be opened with:', openQueue);
    }
  }, [openQueue, session?.accessToken]); // ESLint should flag missing openQueue dependency

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
