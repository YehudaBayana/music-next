import PageInfo from '@/components/PageInfo';
import { MyPlaylistItem } from '@/utils/types';
import Image from 'next/image';
import React from 'react';

const PlaylistInfo = ({ playlist }: { playlist: MyPlaylistItem }) => {
  return (
    <PageInfo
      src={playlist.images[0].url || '/placeholder.jpg'}
      alt={playlist.name || 'playlist image'}
    >
      <h1 className='text-gray-300 text-3xl sm:text-5xl font-bold'>
        {playlist.name}
      </h1>
      <p className='text-gray-300 mt-2 text-sm sm:text-base'>
        {playlist.description || 'A curated selection of top tracks.'}
      </p>
      <p className='text-gray-300 text-sm mt-1'>
        {playlist.owner.display_name}
      </p>
    </PageInfo>
  );
};

export default PlaylistInfo;
