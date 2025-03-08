// components/TrackItem.tsx
'use client';
import React from 'react';
import { GetMyPlaylistsResponse, Track } from '@/utils/types';
import { BsThreeDots } from 'react-icons/bs';
import { msToMinutesAndSeconds } from '@/utils/utils';
import { usePlayer } from '@/context/PlayerContext';
import Image from 'next/image';
import { WithContextMenu } from '@/components/contextMenu/WithContextMenu';
import { useModal } from '@/context/ModalContext';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { PlaylistSelectorModal } from '@/components/modals/PlaylistSelectorModal';
import { spotifyApi } from '@/utils/spotifyApi';
import { useSession } from 'next-auth/react';
import { addTracksToPlaylist } from '@/utils/spotify/playlist/add-tracks-to-playlist';
import { useRouter } from 'next/navigation';
import { PATHS } from '@/components/sidebar/sidebarData';

const TrackItem = ({
  track,
  playlistId,
  albumId,
  dropImage = false,
  dropContext = false,
  context = 'playlist',
  isSelected,
  onToggleSelect,
}: {
  track: Track;
  playlistId?: string;
  albumId?: string;
  dropContext?: boolean;
  dropImage?: boolean;
  context: 'playlist' | 'album' | null;
  isSelected?: boolean;
  onToggleSelect?: (e: React.MouseEvent) => void;
}) => {
  const { playTrack } = usePlayer();
  const { data: session } = useSession();
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const onDelete = () => {
    console.log('TODO: handle delete');
    closeModal();
  };

  const menuOptions = [
    {
      label: 'add to playlist',
      action: async () => {
        if (!session?.accessToken) {
          return console.error('no access token');
        }
        const response = await spotifyApi.get<GetMyPlaylistsResponse>(
          '/me/playlists',
          session?.accessToken
        );
        const playlists = response.items;
        openModal(
          <PlaylistSelectorModal
            playlists={playlists}
            onSelect={async (playlistId) => {
              const res = await addTracksToPlaylist(
                session.accessToken!,
                playlistId,
                [track.uri]
              );
              if (res.snapshot_id) {
                closeModal();
              } else {
                console.log('handle error');
              }
            }}
          />,
          { width: '400px' }
        );
      },
      // icon: <MdOutlinePlaylistAdd />,
    },
    {
      label: 'delete from this playlist',
      action: () =>
        openModal(
          <ConfirmModal
            title='Delete Item'
            message='Are you sure you want to delete this item?'
            onConfirm={onDelete}
            onCancel={() => closeModal()}
          />
        ),
      // icon: <MdOutlinePlaylistAdd />,
    },
    {
      label: 'Add To Queue',
      action: () => console.log('Deleting file...'),
      // icon: <MdOutlineAddToQueue className='w-4 h-4' />,
      disabled: true,
    },
    {
      label: 'Go To Album',
      action: () => router.push(`${PATHS.album}/${track.album.id}`),
      // icon: <MdOutlineAddToQueue className='w-4 h-4' />,
      // disabled: true,
    },
    {
      label: 'Go To Artist',
      action: () => console.log('Deleting file...'),
      // icon: <MdOutlineAddToQueue className='w-4 h-4' />,
      disabled: true,
    },
    {
      label: 'Save to favorites',
      action: () => console.log('Deleting file...'),
      // icon: <MdOutlineAddToQueue className='w-4 h-4' />,
      disabled: true,
    },
  ];

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
    <WithContextMenu options={menuOptions}>
      <div className='flex items-center justify-between py-2 border-b border-gray-300 group relative'>
        {/* <label className='flex items-center space-x-3 overflow-hidden flex-1'> */}

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
            <WithContextMenu
              options={menuOptions}
              triggerType='click'
              // className='p-4 border rounded bg-white cursor-pointer hover:bg-gray-50'
            >
              <BsThreeDots className='text-gray-500 hover:text-purple-600 w-6 h-6' />
            </WithContextMenu>
          )}
          {/* <div className='absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'> */}
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
              // className='w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200'
            />
          )}
          {/* </div> */}
        </div>
        {/* </label> */}
      </div>
    </WithContextMenu>
  );
};

export default TrackItem;
