// "use client"
import { spotifyClient } from '@/api/spotifyClient';
import { MyPlaylistItem } from '@/utils/types';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

type PlaylistSelectorModalProps = {
  onSelect: (playlistId: string) => void;
};

export const PlaylistSelectorModal = ({
  onSelect,
}: PlaylistSelectorModalProps) => {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState<MyPlaylistItem[]>([]);
  useEffect(() => {
    async function getPlaylists() {
      if (!session?.accessToken) {
        return console.error('no access token');
      }
      const response = await spotifyClient.getCurrentUserPlaylists();
      setPlaylists(response.items);
    }
    getPlaylists();
    return () => {};
  }, [session?.accessToken]);

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Add to Playlist</h3>
      <p className='text-gray-600 dark:text-gray-300'>Select a playlist</p>
      <div className='space-y-2 max-h-64 overflow-y-auto'>
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => onSelect(playlist.id)}
            className='w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
          >
            {playlist.name}
          </button>
        ))}
      </div>
    </div>
  );
};
