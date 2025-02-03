import React, { useCallback } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { FaMusic } from 'react-icons/fa';
import SicupLogo from '@/components/SicupLogo';
import Image from 'next/image';
import debounce from 'lodash/debounce';
import { seekTrackRequest } from '@/utils/spotify/player/seek';
import { useSession } from 'next-auth/react';

const seekToPosition = async (accessToken: string, newPosition: number) => {
  await seekTrackRequest({ accessToken, position_ms: newPosition });
  // const [error] = await catchError(
  //   fetch('/api/spotify/player/seek', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ position_ms: newPosition }),
  //   })
  // );
  // if (error) {
  //   console.log('yuda  ', error);
  // }
};

const CurrentPlayingSong = () => {
  const { data: session } = useSession();

  const { currentTrack, progress, setProgress } = usePlayer();
  const debouncedSeek = useCallback(
    debounce((newPosition: number) => {
      if (session?.accessToken) {
        seekToPosition(session.accessToken, newPosition);
      }
    }, 300),
    [session]
  );

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setProgress(newValue);
    debouncedSeek(newValue);
  };

  return (
    <div className='flex items-center p-2 border-2 border-neutral-400 space-x-4 md:w-1/2 w-full overflow-hidden h-16'>
      {currentTrack ? (
        <Image
          src={currentTrack?.album.images[0].url}
          width={currentTrack?.album.images[0].width || 12}
          height={currentTrack?.album.images[0].height || 12}
          alt={currentTrack?.name || 'Album Cover'}
          className='w-12 h-12 rounded-lg object-cover flex-none'
        />
      ) : (
        <FaMusic className='text-gray-600 w-6 h-6' />
      )}

      <div className='flex-1 flex justify-center items-center flex-col overflow-hidden'>
        {currentTrack ? (
          <>
            <h4
              className='text-base font-bold text-black truncate w-full text-center'
              title={currentTrack?.name || 'Unknown Title'}
            >
              {currentTrack?.name || 'Unknown Title'}
            </h4>
            <p
              className='text-sm text-gray-500 truncate w-full text-center'
              title={currentTrack?.artists[0].name || 'Unknown Artist'}
            >
              {currentTrack?.artists[0].name || 'Unknown Artist'}
            </p>
            <div className='overflow-visible w-full flex p-1'>
              <input
                id='slider'
                type='range'
                min='0'
                max={currentTrack?.duration_ms || 100} // Use the track's duration
                value={progress} // Bind slider to the progress value
                onChange={handleSliderChange} // Handler for slider changes
                className='w-full h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer accent-blue-500 thumb-sm relative z-10'
              />
            </div>
          </>
        ) : (
          <SicupLogo textSize='xs' width='12' />
        )}
      </div>
    </div>
  );
};

export default CurrentPlayingSong;
