import { spotifyClient } from '@/api/spotifyClient';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { PlaylistSelectorModal } from '@/components/modals/PlaylistSelectorModal';
import { PATHS } from '@/components/sidebar/sidebarData';
import { useModal } from '@/context/ModalContext';
import useToast from '@/hooks/useToast';
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
  const toast = useToast();
  const router = useRouter();
  const isTrack = track.type === 'track';

  return [
    {
      label: 'Add to Playlist',
      action: async () => {
        openModal(
          <PlaylistSelectorModal
            onSelect={async (playlistId) => {
              toast
                .promise(
                  spotifyClient.addItemsToPlaylist(playlistId, [track.uri]),
                  {
                    success: 'Track added to playlist successfully',
                    error: 'Failed to add track to playlist',
                  }
                )
                .then((result) => {
                  if (result?.snapshot_id) {
                    closeModal();
                  }
                });
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
            toast
              .promise(
                spotifyClient.removeItemsFromPlaylist(context.id, {
                  tracks: [
                    {
                      uri: track.uri,
                    },
                  ],
                }),
                {
                  success: 'Track removed from playlist successfully',
                  error: 'Failed to remove track from playlist',
                }
              )
              .then((result) => {
                if (result?.snapshot_id) {
                  onTracksDeleted?.([track.uri]); // ✅ Call the callback to update the UI
                  closeModal();
                }
              });
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
      action: () => {
        toast.error('This feature is not implemented yet');
      },
      disabled: true,
    },
    {
      label: 'Save to Favorites',
      action: () => {
        toast.error('This feature is not implemented yet');
      },
      disabled: true,
    },
  ];
};
