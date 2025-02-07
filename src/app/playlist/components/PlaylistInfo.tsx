import { MyPlaylistItem } from '@/utils/types';
import Image from 'next/image';
import React from 'react';

const PlaylistInfo = ({ playlist }: { playlist: MyPlaylistItem }) => {
  return (
    <div className='relative w-full  p-8 flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6'>
      <Image
        src={playlist.images[0].url || '/placeholder.jpg'}
        alt={playlist.name || 'playlist image'}
        layout='fill'
        objectFit='cover'
        className='absolute inset-0 w-full h-full object-cover blur-sm brightness-50 -z-10'
      />
      <Image
        src={playlist.images[0].url || '/placeholder.jpg'}
        width={200}
        height={200}
        alt={playlist.name || 'playlist image'}
        className='w-40 h-40 sm:w-52 sm:h-52 object-cover rounded-lg shadow-lg'
      />
      <div className='text-center sm:text-left'>
        <h1 className='text-3xl sm:text-5xl font-bold'>{playlist.name}</h1>
        <p className='text-gray-300 mt-2 text-sm sm:text-base'>
          {playlist.description || 'A curated selection of top tracks.'}
        </p>
        <p className='text-gray-400 text-sm mt-1'>
          {playlist.owner.display_name}
        </p>
      </div>
    </div>
  );
};

export default PlaylistInfo;
