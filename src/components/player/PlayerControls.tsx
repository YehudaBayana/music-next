import { usePlayer } from '@/context/PlayerContext';
import { nextTrackRequest } from '@/api/spotify/player/next';
import { pauseRequest } from '@/api/spotify/player/pause';
import { previousTrackRequest } from '@/api/spotify/player/previous';
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

const pauseTrack = async (accessToken: string) => {
  pauseRequest({ accessToken });
  // const [error] = await catchError(
  //   fetch("/api/spotify/player/pause", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  // );
  // if (error) {
  //   console.log("yuda  ", error);
  // }
};
const nextTrack = async (accessToken: string) => {
  nextTrackRequest({ accessToken });
};
const previousTrack = async (accessToken: string) => {
  previousTrackRequest({ accessToken });
};

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
        onClick={() => previousTrack(accessToken)}
        className='w-6 h-6 cursor-pointer hover:text-gray-600'
      />
      {isPlaying ? (
        <IoPause
          onClick={() => pauseTrack(accessToken)}
          className='w-10 h-10 cursor-pointer hover:text-gray-600'
        />
      ) : (
        <IoPlay
          onClick={() => playTrack({ position_ms: progress })}
          className='w-10 h-10 cursor-pointer hover:text-gray-600'
        />
      )}

      <IoPlaySkipForward
        onClick={() => nextTrack(accessToken)}
        className='w-6 h-6 cursor-pointer hover:text-gray-600'
      />
      <IoRepeat className='w-6 h-6 cursor-pointer hover:text-gray-600' />
    </div>
  );
};

export default PlayerControls;
