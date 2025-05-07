'use client';
import { spotifyClient } from '@/api/spotifyClient';
import useToast from '@/hooks/useToast';

export const useContextMenuOptions = ({
  playlist,
}: {
  playlist: Spotify.Playlist;
}) => {
  const toast = useToast();

  return [
    {
      label: 'follow playlist',
      action: async () => {
        return toast.promise(
          spotifyClient.followPlaylist(playlist.id),
          {
            success: `Successfully followed playlist: ${playlist.name}`,
            error: 'Failed to follow playlist',
          }
        );
      },
    },
  ];
};
