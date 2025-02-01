import Artist from '@/app/search/components/artists/Artist';
import { Artist as ArtistType } from '@/utils/types';
import React from 'react';

const Artists = ({
  artists,
  handleSeeAll,
}: {
  artists: ArtistType[];
  handleSeeAll: (type: string) => void;
}) => {
  return (
    <section className='mt-10'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Artists</h2>
        <button
          onClick={() => handleSeeAll('artist')}
          className='text-green-500 hover:underline'
        >
          See All
        </button>
      </div>
      <div className='flex gap-4 overflow-x-scroll'>
        {artists.map((artist) => (
          <Artist artist={artist} key={artist.id} />
        ))}
      </div>
    </section>
  );
};

export default Artists;
