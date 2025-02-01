import { Artist as ArtistType } from '@/utils/types';
import React from 'react';

const Artist = ({ artist }: { artist: ArtistType }) => {
  return (
    <div key={artist.id} className='w-32 flex-shrink-0 text-center'>
      <img
        src={artist.images[0]?.url}
        alt={artist.name}
        className='w-32 h-32 rounded-full'
      />
      <h3 className='mt-2 font-medium'>{artist.name}</h3>
    </div>
  );
};

export default Artist;
