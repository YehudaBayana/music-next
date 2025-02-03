import { PATHS } from '@/components/sidebar/sidebarData';
import { Album as AlbumType } from '@/utils/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Album = ({ album }: { album: AlbumType }) => {
  return (
    <Link href={`${PATHS.album}/${album.id}`}>
      <div key={album.id} className='w-40 flex-shrink-0'>
        <Image
          src={album.images[0]?.url}
          alt={album.name}
          width={album.images[0].width || 12}
          height={album.images[0].height || 12}
          className='rounded-md'
        />
        <h3 className='text-sm font-medium mt-2'>{album.name}</h3>
        <p className='text-xs text-gray-500'>
          {album.artists.map((a) => a.name).join(', ')}
        </p>
      </div>
    </Link>
  );
};

export default Album;
