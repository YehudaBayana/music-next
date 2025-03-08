import { addTracksToPlaylist } from '@/api/spotify/playlist/add-tracks-to-playlist';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { PlaylistSelectorModal } from '@/components/modals/PlaylistSelectorModal';
import { PATHS } from '@/components/sidebar/sidebarData';
import { useModal } from '@/context/ModalContext';
// import { addTracksToPlaylist } from '@/api/spotify/playlist/add-tracks-to-playlist';
import { Track } from '@/utils/types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const useContextMenuOptions = ({ track }: { track: Track }) => {
  const { openModal, closeModal } = useModal();
  const router = useRouter();
  const { data: session } = useSession();
  const onDelete = () => {
    console.log('TODO: handle delete');
    closeModal();
  };

  return [
    {
      label: 'Add to Playlist',
      action: async () => {
        openModal(
          <PlaylistSelectorModal
            onSelect={async (playlistId) => {
              const res = await addTracksToPlaylist(
                session?.accessToken,
                playlistId,
                [track.uri]
              );
              if (res.snapshot_id) {
                closeModal();
              } else {
                console.error('Error adding to playlist');
              }
            }}
          />,
          { width: '400px' }
        );
      },
    },
    {
      label: 'Delete from this Playlist',
      action: () =>
        openModal(
          <ConfirmModal
            title='Delete Item'
            message='Are you sure you want to delete this item?'
            onConfirm={onDelete}
            onCancel={closeModal}
          />
        ),
    },
    {
      label: 'Go To Album',
      action: () => router.push(`${PATHS.album}/${track.album.id}`),
    },
    {
      label: 'Go To Artist',
      action: () => console.log('TODO: Implement'),
      disabled: true,
    },
    {
      label: 'Save to Favorites',
      action: () => console.log('TODO: Implement'),
      disabled: true,
    },
  ];
};
