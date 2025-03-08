import { MyPlaylistItem } from '@/utils/types';

type PlaylistSelectorModalProps = {
  //   track: Track;
  playlists: MyPlaylistItem[];
  onSelect: (playlistId: string) => void;
};

export const PlaylistSelectorModal = ({
  //   track,
  playlists,
  onSelect,
}: PlaylistSelectorModalProps) => (
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
