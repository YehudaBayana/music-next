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
  context?: Spotify.Playlist | Spotify.Album;
  onTracksDeleted?: (deletedTrackUris: string[]) => void; // ✅ New callback prop
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedTrackUris,
  setSelectedTrackUris,
  context = null,
  onTracksDeleted,
}) => {
  const { data: session } = useSession();
  const { openModal, closeModal } = useModal();
  const [isPlaylistOwner, setIsPlaylistOwner] = useState(false);

  useEffect(() => {
    // Skip API call if not a playlist or missing owner ID
    if (context?.type !== 'playlist' || !(context as any)?.owner?.id) {
      setIsPlaylistOwner(false);
      return;
    }

    // Store a flag to prevent state updates if component unmounts
    let isMounted = true;

    const checkPlaylistOwnership = async () => {
      try {
        const me = await spotifyClient.getCurrentUserProfile();
        // Only update state if component is still mounted
        if (isMounted) {
          setIsPlaylistOwner((context as any).owner.id === me.id);
        }
      } catch (error) {
        console.error(
          'Error checking playlist ownership in BulkActionsBar:',
          error
        );
        // If we hit a rate limit error, don't update state to prevent re-renders
        if (isMounted && !String(error).includes('429')) {
          setIsPlaylistOwner(false);
        }
      }
    };

    checkPlaylistOwnership();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [context, context?.type]); // Only re-run when these specific props change

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
      if (context?.type === 'playlist') {
        const formattedUris = selectedTrackUris.map((uri) => ({ uri }));

        const res = await spotifyClient.removeItemsFromPlaylist(context.id, {
          tracks: formattedUris,
        });

        if (res?.snapshot_id) {
          console.log('Tracks deleted');
          onTracksDeleted?.(selectedTrackUris); // ✅ Call the callback to update the UI
          closeModal();
        }
      }
    };

    openModal(
      <ConfirmModal
        title='Delete Tracks'
        message='Are you sure you want to delete the selected tracks?'
        onConfirm={async () => await onDelete()}
        onCancel={closeModal}
      />
    );
  };

  // ✅ Clear selection after any bulk action
  const handleBulkAction = (action: 'delete' | 'add-to-playlist') => {
    if (action === 'add-to-playlist') {
      handleAddToPlaylist();
    } else if (action === 'delete') {
      console.log('delete');

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
