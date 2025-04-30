import { spotifyClient } from '@/api/spotifyClient';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { PlaylistSelectorModal } from '@/components/modals/PlaylistSelectorModal';
import { PATHS } from '@/components/sidebar/sidebarData';
import { useModal } from '@/context/ModalContext';
import { useRouter } from 'next/navigation';

export const useContextMenuOptions = ({
  track,
  context,
  onTracksDeleted,
}: {
  track: Spotify.Track | Spotify.Episode;
  context?:
    | Spotify.Artist
    | Spotify.Playlist
    | Spotify.Album
    | Spotify.Show
    | undefined;
  onTracksDeleted?: (deletedTrackUris: string[]) => void;
}) => {
  const { openModal, closeModal } = useModal();
  const router = useRouter();
  const isTrack = track.type === 'track';

  return [
    {
      label: 'Add to Playlist',
      action: async () => {
        openModal(
          <PlaylistSelectorModal
            onSelect={async (playlistId) => {
              const res = await spotifyClient.addItemsToPlaylist(playlistId, [
                track.uri,
              ]);
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
      action: () => {
        const onDelete = async () => {
          if (context?.type === 'playlist') {
            const res = await spotifyClient.removeItemsFromPlaylist(
              context.id,
              {
                tracks: [
                  {
                    uri: track.uri,
                  },
                ],
              }
            );

            if (res?.snapshot_id) {
              console.log('Tracks deleted');
              onTracksDeleted?.([track.uri]); // ✅ Call the callback to update the UI
              closeModal();
            }
          }
        };

        openModal(
          <ConfirmModal
            title='Delete Item'
            message='Are you sure you want to delete this item?'
            onConfirm={onDelete}
            onCancel={closeModal}
          />
        );
      },
    },
    {
      label: isTrack ? 'Go To Album' : 'Go To Show(not yet)',
      action: () =>
        router.push(`${PATHS.album}/${isTrack ? track.album.id : ''}`),
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
