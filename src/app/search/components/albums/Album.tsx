import { Album as AlbumType } from '@/utils/types';
import React from 'react';

const Album = ({ album }: { album: AlbumType }) => {
  return (
    <div key={album.id} className='w-40 flex-shrink-0'>
      <img src={album.images[0]?.url} alt={album.name} className='rounded-md' />
      <h3 className='text-sm font-medium mt-2'>{album.name}</h3>
      <p className='text-xs text-gray-500'>
        {album.artists.map((a) => a.name).join(', ')}
      </p>
    </div>
  );
};

export default Album;
