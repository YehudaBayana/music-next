import { PATHS } from '@/components/sidebar/sidebarData';
import { Artist as ArtistType } from '@/utils/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Artist = ({ artist }: { artist: ArtistType }) => {
  return (
    <div key={artist.id} className='w-32 flex-shrink-0 text-center'>
      <Link href={`${PATHS.artist}/${artist.id}`}>
        <Image
          src={artist.images[0]?.url}
          alt={artist.name}
          width={artist.images[0].width || 12}
          height={artist.images[0].height || 12}
          className='w-32 h-32 rounded-full'
        />
        <h3 className='mt-2 font-medium'>{artist.name}</h3>
      </Link>
    </div>
  );
};

export default Artist;
