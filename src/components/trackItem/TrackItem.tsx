// components/TrackItem.tsx
'use client';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { msToMinutesAndSeconds } from '@/utils/utils';
import { usePlayer } from '@/context/PlayerContext';
import Image from 'next/image';
import { WithContextMenu } from '@/components/contextMenu/WithContextMenu';
import { useContextMenuOptions } from '@/components/trackItem/hooks/useMenuOptions';

const TrackItem = ({
  track,
  dropImage = false,
  context = undefined,
  isSelected,
  onToggleSelect,
  nextUris = [],
  onTracksDeleted,
}: {
  track: Spotify.Track | Spotify.Episode;
  context_uri?: string;
  dropContext?: boolean;
  dropImage?: boolean;
  context?:
    | Spotify.Artist
    | Spotify.Playlist
    | Spotify.Album
    | Spotify.Show
    | undefined;
  isSelected?: boolean;
  onToggleSelect?: (e: React.MouseEvent) => void;
  nextUris?: string[];
  onTracksDeleted?: (deletedTrackUris: string[]) => void;
}) => {
  const isTrack = track.type === 'track';
  const { playTrack } = usePlayer();
  const contextMenuOptions = useContextMenuOptions({
    track,
    onTracksDeleted,
    context,
  });

  const handleTrackClick = () => {
    const offset = {
      uri: track.uri,
    };

    switch (context?.type) {
      case 'playlist':
        playTrack({
          context_uri: context.uri,
          offset,
          position_ms: 0,
        });
        break;
      case 'album':
        playTrack({
          context_uri: context.uri,
          offset,
          position_ms: 0,
        });
        break;
      default:
        playTrack({
          uris: [track.uri, ...nextUris],
          position_ms: 0,
        });
        break;
    }
  };

  return (
    <WithContextMenu options={contextMenuOptions}>
      <div
        onClick={handleTrackClick}
        className='flex items-center justify-between px-3 py-1.5 group relative hover:bg-primary cursor-pointer rounded-md'
      >
        <div className='flex items-center space-x-3 overflow-hidden'>
          {!dropImage && isTrack ? (
            <Image
              src={track.album.images[0].url}
              width={track.album.images[0].width || 12}
              height={track.album.images[0].height || 12}
              alt={track.name}
              className='w-12 h-12 rounded-lg object-cover'
            />
          ) : !dropImage && track.type === 'episode' ? (
            <Image
              src={track.images[0].url}
              width={track.images[0].width || 12}
              height={track.images[0].height || 12}
              alt={track.name}
              className='w-12 h-12 rounded-lg object-cover'
            />
          ) : null}

          <div className='overflow-hidden'>
            <p
              className='text-sm font-medium truncate overflow-hidden text-ellipsis pr-2'
              title={track.name}
            >
              {track.name}
            </p>
            <p
              className='text-xs text-gray-500 truncate overflow-hidden text-ellipsis'
              title={isTrack ? track.artists[0].name : 'TODO: put show'}
            >
              {isTrack ? track.artists[0].name : 'TODO: put show'}
            </p>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <p className='text-sm text-gray-600'>
            {msToMinutesAndSeconds(track.duration_ms)}
          </p>

          {context && (
            <WithContextMenu options={contextMenuOptions} triggerType='click'>
              <BsThreeDots className='text-gray-500 hover:text-purple-600 w-6 h-6' />
            </WithContextMenu>
          )}

          {onToggleSelect && (
            <input
              type='checkbox'
              checked={isSelected}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect(e);
              }}
              onChange={() => {}}
              className={` w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 ${
                isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              } transition-opacity duration-200`}
            />
          )}
        </div>
      </div>
      <hr className='border-t-1 border-stone-400' />
    </WithContextMenu>
  );
};

export default TrackItem;
