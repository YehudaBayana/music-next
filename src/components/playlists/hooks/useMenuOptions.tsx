'use client';
import { spotifyClient } from '@/api/spotifyClient';

export const useContextMenuOptions = ({
  playlist,
}: {
  playlist: Spotify.Playlist;
}) => {
  return [
    {
      label: 'follow playlist',
      action: async () => {
        return spotifyClient.followPlaylist(playlist.id);
      },
    },
  ];
};
