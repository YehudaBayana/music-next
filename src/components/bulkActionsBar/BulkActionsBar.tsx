'use client';

import React, { useEffect, useState } from 'react';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { PlaylistSelectorModal } from '@/components/modals/PlaylistSelectorModal';
import { useModal } from '@/context/ModalContext';
import { useSession } from 'next-auth/react';
import { spotifyClient } from '@/api/spotifyClient';

interface BulkActionsBarProps {
  selectedTrackUris: string[];
  setSelectedTrackUris: React.Dispatch<React.SetStateAction<string[]>>;
  contextType: 'playlist' | 'album';
  context: Spotify.Playlist | Spotify.Album;
  snapshotId?: string; // Optional for playlists
  onTracksDeleted?: (deletedTrackUris: string[]) => void; // ✅ New callback prop
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedTrackUris,
  setSelectedTrackUris,
  contextType,
  context,
  snapshotId,
  onTracksDeleted,
}) => {
  const { data: session } = useSession();
  const { openModal, closeModal } = useModal();
  const [isPlaylistOwner, setIsPlaylistOwner] = useState(false);

  useEffect(() => {
    if (contextType === 'playlist') {
      const something = async () => {
        const me = await spotifyClient.getCurrentUserProfile();
        setIsPlaylistOwner((context as any).owner.id === me.id);
      };

      something();

      return () => {};
    }
  }, [contextType, (context as any)?.owner?.id]);

  // ✅ Handles adding tracks to a playlist
  const handleAddToPlaylist = () => {
    openModal(
      <PlaylistSelectorModal
        onSelect={async (playlistId) => {
          const res = await spotifyClient.addItemsToPlaylist(
            playlistId,
            selectedTrackUris
          );
          if (res?.snapshot_id) {
            closeModal();
          } else {
            console.error('Failed to add tracks');
          }
        }}
      />,
      { width: '400px' }
    );
  };

  // ✅ Handles deleting tracks
  const handleDelete = () => {
    if (!session?.accessToken) return console.error('No access token');

    const onDelete = async () => {
      if (contextType !== 'playlist') {
        console.error('Album track deletion not supported');
        return;
      }
      const formattedUris = selectedTrackUris.map((uri) => ({ uri }));
      const res = await spotifyClient.removeItemsFromPlaylist(context.id, {
        tracks: formattedUris,
        snapshot_id: snapshotId!,
      });
      if (res?.snapshot_id) {
        console.log('Tracks deleted');
        onTracksDeleted?.(selectedTrackUris); // ✅ Call the callback to update the UI
        closeModal();
      }
    };

    openModal(
      <ConfirmModal
        title='Delete Tracks'
        message='Are you sure you want to delete the selected tracks?'
        onConfirm={onDelete}
        onCancel={closeModal}
      />
    );
  };

  // ✅ Clear selection after any bulk action
  const handleBulkAction = (action: 'delete' | 'add-to-playlist') => {
    if (action === 'add-to-playlist') {
      handleAddToPlaylist();
    } else {
      handleDelete();
    }
    setSelectedTrackUris([]);
  };

  // ✅ Action Button Component
  const ActionButton: React.FC<{
    label: string;
    onClick: () => void;
    color: string;
  }> = ({ label, onClick, color }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-white rounded transition-colors ${
        color === 'blue'
          ? 'bg-blue-500 hover:bg-blue-600'
          : 'bg-red-500 hover:bg-red-600'
      }`}
    >
      {label}
    </button>
  );

  if (selectedTrackUris.length === 0) return null;

  return (
    <div className='fixed bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex gap-4 items-center'>
      <span className='text-gray-600 dark:text-gray-300'>
        {selectedTrackUris.length} selected
      </span>
      <ActionButton
        label='Add to Playlist'
        onClick={() => handleBulkAction('add-to-playlist')}
        color='blue'
      />
      {isPlaylistOwner && (
        <ActionButton
          label='Delete'
          onClick={() => handleBulkAction('delete')}
          color='red'
        />
      )}

      <button
        onClick={() => setSelectedTrackUris([])}
        className='px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
      >
        Cancel
      </button>
    </div>
  );
};

export default BulkActionsBar;
