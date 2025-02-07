import Card from '@/components/Card';
import { PATHS } from '@/components/sidebar/sidebarData';
import { Album as AlbumType } from '@/utils/types';
import React from 'react';

const Album = ({ album }: { album: AlbumType }) => {
  return (
    <Card
      src={album.images[0]?.url}
      alt={album.name}
      href={`${PATHS.album}/${album.id}`}
    >
      <h3 className='text-sm font-medium mt-2'>{album.name}</h3>
      <p className='text-xs text-gray-500'>
        {album.artists.map((a) => a.name).join(', ')}
      </p>
    </Card>
  );
};

export default Album;
