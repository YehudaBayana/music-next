'use client';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { PlaylistSelectorModal } from '@/components/modals/PlaylistSelectorModal';
import { useModal } from '@/context/ModalContext';
import { addTracksToPlaylist } from '@/utils/spotify/playlist/add-tracks-to-playlist';
import { deleteTracksFromPlaylist } from '@/utils/spotify/playlist/delete-tracks-from-playlist';
import { spotifyApi } from '@/utils/spotifyApi';
import { GetMyPlaylistsResponse } from '@/utils/types';
import { useSession } from 'next-auth/react';
import React from 'react';

interface BulkActionsBarProps {
  selectedTrackUris: string[];
  setSelectedTrackUris: React.Dispatch<React.SetStateAction<string[]>>;
  contextType: 'playlist' | 'album';
  contextId: string;
  snapshotId?: string; // Optional for playlists
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedTrackUris,
  setSelectedTrackUris,
  contextType,
  contextId,
  snapshotId,
}) => {
  const { data: session } = useSession();
  const { openModal, closeModal } = useModal();
  const handleBulkAction = async (action: 'delete' | 'add-to-playlist') => {
    switch (action) {
      case 'add-to-playlist':
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
            // track={track}
            playlists={playlists}
            onSelect={async (playlistId) => {
              const res = await addTracksToPlaylist(
                session.accessToken!,
                playlistId,
                selectedTrackUris
              );
              if (res?.snapshot_id) {
                closeModal();
              } else {
                console.log('handle error');
              }
            }}
          />,
          { width: '400px' }
        );
        break;
      case 'delete':
        const onDelete = async () => {
          if (!session?.accessToken) {
            return console.error('no access token');
          }

          if (contextType === 'playlist') {
            const res = await deleteTracksFromPlaylist(
              session.accessToken!,
              contextId,
              selectedTrackUris,
              snapshotId! // Use the passed snapshotId
            );

            if (res?.snapshot_id) {
              console.log('deleted');
              closeModal();
            }
          } else {
            console.log('Album track deletion not supported');
            // Handle album track deletion if needed
          }
        };
        openModal(
          <ConfirmModal
            title='Delete Item'
            message='Are you sure you want to delete this item?'
            onConfirm={onDelete}
            onCancel={() => closeModal()}
          />
        );

        break;
      default:
        break;
    }
    console.log(`Performing ${action} on:`, selectedTrackUris);
    // Implement your bulk action logic here
    setSelectedTrackUris([]); // Clear selection after action
  };

  return (
    selectedTrackUris.length > 0 && (
      <div className='fixed bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex gap-4 items-center'>
        <span className='text-gray-600 dark:text-gray-300'>
          {selectedTrackUris.length} selected
        </span>
        <button
          onClick={() => handleBulkAction('add-to-playlist')}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Add to Playlist
        </button>
        <button
          onClick={() => handleBulkAction('delete')}
          className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
        >
          Delete
        </button>
        <button
          onClick={() => setSelectedTrackUris([])}
          className='px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
        >
          Cancel
        </button>
      </div>
    )
  );
};

export default BulkActionsBar;
