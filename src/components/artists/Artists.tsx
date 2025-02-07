import Artist from '@/components/artists/Artist';
import { Artist as ArtistType } from '@/utils/types';
import React from 'react';

const Artists = ({
  artists,
  path,
}: {
  artists: ArtistType[];
  path: string;
}) => {
  return (
    <section className='mt-10'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Artists</h2>
        {/* <Link href={path}>
          <button
            // onClick={() => handleSeeAll('track')}
            className='text-green-500 hover:underline'
          >
            See All
          </button>
        </Link> */}
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
