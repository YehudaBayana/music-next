import Album from '@/components/albums/Album';
import { Album as AlbumType } from '@/utils/types';
import Link from 'next/link';
import React from 'react';

const Albums = ({ albums, path }: { albums: AlbumType[]; path: string }) => {
  return (
    <section className='mt-10'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Albums</h2>
        <Link href={path}>
          <button
            // onClick={() => handleSeeAll('track')}
            className='text-green-500 hover:underline'
          >
            See All
          </button>
        </Link>
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
