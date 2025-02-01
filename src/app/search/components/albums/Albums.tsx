import Album from '@/app/search/components/albums/Album';
import { Album as AlbumType } from '@/utils/types';
import React from 'react';

const Albums = ({
  albums,
  handleSeeAll,
}: {
  albums: AlbumType[];
  handleSeeAll: (type: string) => void;
}) => {
  return (
    <section className='mt-10'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Albums</h2>
        <button
          onClick={() => handleSeeAll('album')}
          className='text-green-500 hover:underline'
        >
          See All
        </button>
      </div>
      <div className='flex gap-4 overflow-x-scroll'>
        {albums.map((album) => (
          <Album album={album} key={album.id} />
        ))}
      </div>
    </section>
  );
};

export default Albums;
