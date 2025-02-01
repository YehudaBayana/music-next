import { PATHS } from '@/components/sidebar/sidebarData';
import { MyPlaylistItem } from '@/utils/types';
import Link from 'next/link';
import React from 'react';

const Playlist = ({ playlist }: { playlist: MyPlaylistItem }) => {
  return (
    <Link href={`${PATHS.playlist}/${playlist.id}`}>
      <div key={playlist.id} className='w-40 flex-shrink-0'>
        <img
          src={playlist.images[0]?.url}
          alt={playlist.name}
          className='rounded-md'
        />
        <h3 className='text-sm font-medium mt-2'>{playlist.name}</h3>
      </div>
    </Link>
  );
};

export default Playlist;
