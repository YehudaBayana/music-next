import Playlist from '@/app/search/components/playlists/Playlist';
import { MyPlaylistItem } from '@/utils/types';
import React from 'react';

const Playlists = ({
  playlists,
  handleSeeAll,
}: {
  playlists: MyPlaylistItem[];
  handleSeeAll: (type: string) => void;
}) => {
  return (
    <section className='mt-10'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Playlists</h2>
        <button
          onClick={() => handleSeeAll('playlist')}
          className='text-green-500 hover:underline'
        >
          See All
        </button>
      </div>
      <div className='flex gap-4 overflow-x-scroll'>
        {playlists.map((playlist) => (
          <Playlist playlist={playlist} key={playlist.id} />
        ))}
      </div>
    </section>
  );
};

export default Playlists;
