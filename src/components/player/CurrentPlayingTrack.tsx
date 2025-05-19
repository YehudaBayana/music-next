import React, { useEffect, useMemo } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { FaMusic } from 'react-icons/fa';
import SicupLogo from '@/components/SicupLogo';
import Image from 'next/image';
import debounce from 'lodash/debounce';
import { spotifyClient } from '@/api/spotifyClient';
import LikeButton from '@/components/likeButton/LikeButton';

const CurrentPlayingSong = () => {
  const { currentTrack, progress, setProgress } = usePlayer();
  const isTrack = currentTrack?.type === 'track';

  const debouncedSeek = useMemo(() => {
    return debounce((newPosition: number) => {
      spotifyClient.seekToPosition(newPosition);
    }, 300);
  }, []);

  useEffect(() => {
    // Clean up debounced function on unmount
    return () => {
      debouncedSeek.cancel();
    };
  }, [debouncedSeek]);

  // We removed this effect since we're now getting progress updates from the
  // polling mechanism in Player.tsx which fetches the current track state from Spotify API

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setProgress(newValue);
    debouncedSeek(newValue);
  };

  return (
    <div className='flex items-center p-2 border-2 border-neutral-400 space-x-4 md:w-1/2 w-full overflow-hidden h-16'>
      {currentTrack ? (
        isTrack ? (
          <Image
            src={currentTrack?.album.images[0].url}
            width={currentTrack?.album.images[0].width || 12}
            height={currentTrack?.album.images[0].height || 12}
            alt={currentTrack?.name || 'Album Cover'}
            className='w-12 h-12 rounded-lg object-cover flex-none'
          />
        ) : (
          <Image
            src={currentTrack?.images[0].url}
            width={currentTrack?.images[0].width || 12}
            height={currentTrack?.images[0].height || 12}
            alt={currentTrack?.name || 'Album Cover'}
            className='w-12 h-12 rounded-lg object-cover flex-none'
          />
        )
      ) : (
        <FaMusic className='text-gray-600 w-6 h-6' />
      )}

      <div className='flex-1 flex justify-center items-center flex-col overflow-hidden'>
        {currentTrack ? (
          <>
            <div className='flex items-center justify-center w-full space-x-2'>
              <h4
                className='text-base font-bold text-black truncate w-full text-center'
                title={currentTrack?.name || 'Unknown Title'}
              >
                {currentTrack?.name || 'Unknown Title'}
              </h4>

              {/* Like Button for the current playing track */}
              {isTrack && (
                <LikeButton
                  trackId={currentTrack.id}
                  isTrack={isTrack}
                  showAlways={true}
                  className='flex-none'
                />
              )}
            </div>
            <p
              className='text-sm text-gray-500 truncate w-full text-center'
              title={
                (isTrack && currentTrack?.artists[0].name) || 'Unknown Artist'
              }
            >
              {(isTrack && currentTrack?.artists[0].name) || 'Unknown Artist'}
            </p>
            <div className='overflow-visible w-full flex p-1'>
              <input
                id='slider'
                type='range'
                min='0'
                max={currentTrack?.duration_ms || 100} // Use the track's duration
                value={progress} // Bind slider to the progress value
                onChange={handleSliderChange} // Handler for slider changes
                className='w-full h-1 bg-darkSecondary rounded-lg appearance-none cursor-pointer accent-primary thumb-sm relative z-10
                [&::-webkit-slider-thumb]:bg-primary
                '
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
