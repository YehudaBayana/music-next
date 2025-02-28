// components/TrackItem.tsx
'use client';
import React from 'react';
import { Track } from '@/utils/types';
import { BsThreeDots } from 'react-icons/bs';
import { msToMinutesAndSeconds } from '@/utils/utils';
import { usePlayer } from '@/context/PlayerContext';
import Image from 'next/image';

const TrackItem = ({
  track,
  playlistId,
  albumId,
  dropImage = false,
  dropContext = false,
  context = 'playlist',
}: {
  track: Track;
  playlistId?: string;
  albumId?: string;
  dropContext?: boolean;
  dropImage?: boolean;
  context: 'playlist' | 'album' | null;
}) => {
  const { playTrack } = usePlayer();

  const handleTrackClick = () => {
    const offset = {
      uri: track.uri,
    };

    switch (context) {
      case 'playlist':
        playTrack({
          context_uri: `spotify:playlist:${playlistId}`,
          offset,
          position_ms: 0,
        });
        break;
      case 'album':
        playTrack({
          context_uri: `spotify:album:${albumId}`,
          offset,
          position_ms: 0,
        });
        break;
      default:
        playTrack({
          uris: [track.uri],
          position_ms: 0,
        });
        break;
    }
  };

  return (
    <div className='flex items-center justify-between py-2 border-b border-gray-300'>
      <div
        onClick={handleTrackClick}
        className='flex items-center space-x-3 overflow-hidden'
      >
        {!dropImage && (
          <Image
            src={track.album.images[0].url}
            width={track.album.images[0].width || 12}
            height={track.album.images[0].height || 12}
            alt={track.name}
            className='w-12 h-12 rounded-lg object-cover'
          />
        )}

        <div className='overflow-hidden'>
          <p
            className='text-sm font-medium truncate overflow-hidden text-ellipsis pr-2'
            title={track.name}
          >
            {track.name}
          </p>
          <p
            className='text-xs text-gray-500 truncate overflow-hidden text-ellipsis'
            title={track.artists[0].name}
          >
            {track.artists[0].name}
          </p>
        </div>
      </div>
      <div className='flex items-center space-x-2'>
        <p className='text-sm text-gray-600'>
          {msToMinutesAndSeconds(track.duration_ms)}
        </p>
        {!dropContext && (
          <BsThreeDots className='text-gray-500 hover:text-purple-600 w-6 h-6' />
        )}
      </div>
    </div>
  );
};

export default TrackItem;
